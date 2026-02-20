from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Cart, CartItem
from products.models import Product
from django.db.models import Sum


def get_or_create_cart(request):
    """
    If the user is logged in, get or create a cart tied to their account.
    If they are a guest, use a session-based cart ID stored in their session.
    """
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart
    else:
        cart_id = request.session.get('guest_cart_id')
        if cart_id:
            try:
                return Cart.objects.get(id=cart_id, user=None)
            except Cart.DoesNotExist:
                pass
        cart = Cart.objects.create(user=None)
        request.session['guest_cart_id'] = cart.id
        return cart


def get_cart_count(cart):
    total = CartItem.objects.filter(cart=cart).aggregate(Sum('quantity'))['quantity__sum']
    return total if total else 0


@api_view(['POST'])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))

    cart = get_or_create_cart(request)

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not created:
        cart_item.quantity += quantity
    else:
        cart_item.quantity = quantity

    cart_item.save()

    return Response({
        "message": f"Added {product.title} to cart!",
        "cart_count": get_cart_count(cart)
    })


@api_view(['GET'])
def get_cart(request):
    cart = get_or_create_cart(request)
    items = CartItem.objects.filter(cart=cart).select_related('product')

    cart_data = []
    grand_total = 0
    for item in items:
        item_total = item.product.price * item.quantity
        grand_total += item_total
        cart_data.append({
            "id": item.id,
            "product_id": item.product.id,
            "product_name": item.product.title,
            "product_price": float(item.product.price),
            "product_image": item.product.image if item.product.image else None,
            "quantity": item.quantity,
            "item_total": float(item_total)
        })

    return Response({
        "items": cart_data,
        "grand_total": float(grand_total),
        "cart_count": get_cart_count(cart)
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def merge_guest_cart(request):
    """
    Called right after login. Accepts a list of guest cart items from the
    frontend (since session cookies don't carry over between guest/auth state)
    and merges them into the logged-in user's cart.

    Expected body:
    {
        "items": [
            { "product_id": 1, "quantity": 2 },
            ...
        ]
    }
    """
    guest_items = request.data.get('items', [])

    if not guest_items:
        return Response({"message": "Nothing to merge."})

    user_cart, _ = Cart.objects.get_or_create(user=request.user)

    merged = 0
    for item_data in guest_items:
        product_id = item_data.get('product_id')
        quantity = int(item_data.get('quantity', 1))

        if not product_id or quantity < 1:
            continue

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            continue

        cart_item, created = CartItem.objects.get_or_create(
            cart=user_cart,
            product=product
        )

        if created:
            cart_item.quantity = quantity
        else:
            # Add guest quantity on top of existing quantity
            cart_item.quantity += quantity

        cart_item.save()
        merged += 1

    return Response({
        "message": f"Merged {merged} item(s) into your cart.",
        "cart_count": get_cart_count(user_cart)
    })


@api_view(['PATCH'])
def update_cart_item(request, item_id):
    """Change the quantity of a specific cart item."""
    try:
        item = CartItem.objects.get(id=item_id)
        cart = get_or_create_cart(request)
        if item.cart != cart:
            return Response({"error": "Not allowed"}, status=403)

        new_qty = int(request.data.get('quantity', 1))
        if new_qty < 1:
            return Response({"error": "Quantity must be at least 1"}, status=400)

        item.quantity = new_qty
        item.save()

        return Response({
            "message": "Quantity updated",
            "cart_count": get_cart_count(cart)
        })
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)


@api_view(['POST'])
def clear_cart(request):
    cart = get_or_create_cart(request)
    CartItem.objects.filter(cart=cart).delete()
    return Response({'message': 'Cart cleared'}, status=200)


@api_view(['DELETE'])
def remove_cart_item(request, item_id):
    try:
        item = CartItem.objects.get(id=item_id)
        cart = get_or_create_cart(request)
        if item.cart != cart:
            return Response({"error": "Not allowed"}, status=403)
        item.delete()
        return Response({
            "message": "Item removed",
            "cart_count": get_cart_count(cart)
        }, status=200)
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)