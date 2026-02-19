from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Order, OrderItem
from products.models import Product


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_history(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    data = []
    for order in orders:
        items_data = [
            {
                'product_name': item.product_name,
                'product_price': float(item.product_price),
                'quantity': item.quantity,
                'item_total': float(item.product_price * item.quantity)
            }
            for item in order.items.all()
        ]
        data.append({
            'id': order.id,
            'status': order.status,
            'total_amount': float(order.total_amount),
            'transaction_id': order.transaction_id,
            'created_at': order.created_at.strftime('%b %d, %Y at %I:%M %p'),
            'updated_at': order.updated_at.strftime('%b %d, %Y at %I:%M %p'),
            'items': items_data
        })
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    items = request.data.get('items', [])
    total_amount = request.data.get('total_amount')
    transaction_id = request.data.get('transaction_id', '')

    if not items or not total_amount:
        return Response({'error': 'Missing items or total.'}, status=status.HTTP_400_BAD_REQUEST)

    order = Order.objects.create(
        user=request.user,
        total_amount=total_amount,
        transaction_id=transaction_id,
        status='pending'
    )

    for item in items:
        product = None
        product_id = item.get('product_id')
        if product_id:
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                pass

        OrderItem.objects.create(
            order=order,
            product=product,
            product_name=item.get('product_name', 'Unknown'),
            product_price=item.get('product_price', 0),
            quantity=item.get('quantity', 1)
        )

    return Response({'message': 'Order created.', 'order_id': order.id}, status=status.HTTP_201_CREATED)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    """Admin only — update an order's status."""
    if not request.user.is_staff:
        return Response({'error': 'Forbidden'}, status=403)

    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)

    new_status = request.data.get('status')
    valid = [s[0] for s in Order.STATUS_CHOICES]
    if new_status not in valid:
        return Response({'error': f'Invalid status. Choose from: {valid}'}, status=400)

    order.status = new_status
    order.save()
    return Response({'message': f'Order #{order.id} updated to {new_status}.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_orders(request):
    """Admin only — all orders from all users."""
    if not request.user.is_staff:
        return Response({'error': 'Forbidden'}, status=403)

    orders = Order.objects.select_related('user').order_by('-created_at')
    data = [
        {
            'id': o.id,
            'username': o.user.username,
            'total_amount': float(o.total_amount),
            'status': o.status,
            'transaction_id': o.transaction_id,
            'item_count': o.items.count(),
            'created_at': o.created_at.strftime('%b %d, %Y at %I:%M %p'),
        }
        for o in orders
    ]
    return Response(data)