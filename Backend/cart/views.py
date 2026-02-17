from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Cart, CartItem
from products.models import Product
from django.db.models import Sum

# Helper function to get the total quantity of items in the cart
def get_current_cart_count(cart):
    # Sums up all 'quantity' fields for items in this cart
    total = CartItem.objects.filter(cart=cart).aggregate(Sum('quantity'))['quantity__sum']
    return total if total else 0

@api_view(['POST'])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))
    
    cart, _ = Cart.objects.get_or_create(id=1) 
    
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

    # Get the fresh count after saving
    current_count = get_current_cart_count(cart)

    return Response({
        "message": f"Added {product.title} to cart!",
        "cart_count": current_count  # Send new count to React
    })

@api_view(['GET'])
def get_cart(request):
    try:
        cart = Cart.objects.get(id=1)
        items = CartItem.objects.filter(cart=cart)
        
        cart_data = []
        grand_total = 0
        for item in items:
            item_total = item.product.price * item.quantity
            grand_total += item_total
            cart_data.append({
                "id": item.id,
                "product_name": item.product.title,
                "product_price": float(item.product.price),
                "product_image": item.product.image.url if item.product.image else None,
                "quantity": item.quantity,
                "item_total": float(item_total)
            })
            
        return Response({
            "items": cart_data, 
            "grand_total": float(grand_total),
            "cart_count": get_current_cart_count(cart)
        })
    except Cart.DoesNotExist:
        return Response({"items": [], "grand_total": 0, "cart_count": 0})

@api_view(['DELETE'])
def remove_cart_item(request, item_id):
    try:
        item = CartItem.objects.get(id=item_id)
        cart = item.cart # Save reference to the cart before deleting item
        item.delete()
        
        # Get fresh count after deletion
        current_count = get_current_cart_count(cart)
        
        return Response({
            "message": "Item removed",
            "cart_count": current_count # Send new count so Navbar updates
        }, status=200) # Changed to 200 to allow sending data back
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)