from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Payment, PaymentItem
from orders.models import Order, OrderItem
from products.models import Product


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_payment(request):
    transaction_id = request.data.get('transaction_id', '').strip()
    total_amount = request.data.get('total_amount')
    items = request.data.get('items', [])

    if not transaction_id:
        return Response({'error': 'Transaction ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

    if not total_amount or float(total_amount) <= 0:
        return Response({'error': 'Invalid total amount.'}, status=status.HTTP_400_BAD_REQUEST)

    if not items:
        return Response({'error': 'No items in order.'}, status=status.HTTP_400_BAD_REQUEST)

    if Payment.objects.filter(transaction_id=transaction_id).exists():
        return Response({'error': 'This Transaction ID has already been submitted.'}, status=status.HTTP_400_BAD_REQUEST)

    # Create Payment record
    payment = Payment.objects.create(
        user=request.user,
        transaction_id=transaction_id,
        total_amount=total_amount,
        status='pending'
    )

    # Create Order record at the same time
    order = Order.objects.create(
        user=request.user,
        total_amount=total_amount,
        transaction_id=transaction_id,
        status='pending'
    )

    for item in items:
        product = None
        product_id = item.get('product_id') or item.get('id')
        if product_id:
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                pass

        name = item.get('product_name') or item.get('product', {}).get('title', 'Unknown')
        price = item.get('product_price') or item.get('product', {}).get('price', 0)
        qty = item.get('quantity', 1)

        PaymentItem.objects.create(
            payment=payment,
            product=product,
            product_name=name,
            product_price=price,
            quantity=qty
        )

        OrderItem.objects.create(
            order=order,
            product=product,
            product_name=name,
            product_price=price,
            quantity=qty
        )

    return Response({
        'message': 'Order placed! Verification takes 5–10 minutes.',
        'payment_id': payment.id,
        'order_id': order.id,
        'status': payment.status
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payment_history(request):
    payments = Payment.objects.filter(user=request.user).order_by('-created_at')

    data = []
    for payment in payments:
        items_data = [
            {
                'product_name': item.product_name,
                'product_price': float(item.product_price),
                'quantity': item.quantity,
                'item_total': float(item.product_price * item.quantity)
            }
            for item in payment.items.all()
        ]
        data.append({
            'id': payment.id,
            'transaction_id': payment.transaction_id,
            'total_amount': float(payment.total_amount),
            'status': payment.status,
            'created_at': payment.created_at.strftime('%b %d, %Y at %I:%M %p'),
            'items': items_data
        })

    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_payments(request):
    """ Admin only — returns all payments from all users """
    if not request.user.is_staff:
        return Response({'error': 'Forbidden'}, status=403)

    payments = Payment.objects.select_related('user').order_by('-created_at')
    data = [
        {
            'id': p.id,
            'username': p.user.username,
            'transaction_id': p.transaction_id,
            'total_amount': float(p.total_amount),
            'status': p.status,
            'created_at': p.created_at.strftime('%b %d, %Y at %I:%M %p'),
        }
        for p in payments
    ]
    return Response(data)