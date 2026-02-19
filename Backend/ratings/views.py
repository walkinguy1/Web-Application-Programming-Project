from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import ProductRating
from products.models import Product
from orders.models import OrderItem


@api_view(['GET'])
def get_product_ratings(request, product_id):
    """Public — returns all ratings + average for a product."""
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    ratings = ProductRating.objects.filter(product=product).select_related('user').order_by('-created_at')

    data = {
        'average': float(product.rating_rate),
        'count': ratings.count(),
        'ratings': [
            {
                'id': r.id,
                'username': r.user.username,
                'score': r.score,
                'review': r.review,
                'created_at': r.created_at.strftime('%b %d, %Y'),
            }
            for r in ratings
        ]
    }
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_rating(request, product_id):
    """Returns the logged-in user's rating + whether they're eligible to rate."""
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    has_purchased = OrderItem.objects.filter(
        order__user=request.user,
        product=product
    ).exists()

    try:
        rating = ProductRating.objects.get(product=product, user=request.user)
        return Response({
            'has_purchased': has_purchased,
            'my_rating': {
                'score': rating.score,
                'review': rating.review,
            }
        })
    except ProductRating.DoesNotExist:
        return Response({
            'has_purchased': has_purchased,
            'my_rating': None
        })


@api_view(['POST', 'PUT'])
@permission_classes([IsAuthenticated])
def submit_rating(request, product_id):
    """Submit or update a rating. Only buyers can rate."""
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    has_purchased = OrderItem.objects.filter(
        order__user=request.user,
        product=product
    ).exists()

    if not has_purchased:
        return Response(
            {'error': 'You can only rate products you have purchased.'},
            status=status.HTTP_403_FORBIDDEN
        )

    score = request.data.get('score')
    review = request.data.get('review', '').strip()

    if not score or not (1 <= int(score) <= 5):
        return Response({'error': 'Score must be between 1 and 5.'}, status=400)

    rating, created = ProductRating.objects.update_or_create(
        product=product,
        user=request.user,
        defaults={'score': int(score), 'review': review}
    )

    return Response({
        'message': 'Rating submitted!' if created else 'Rating updated!',
        'score': rating.score,
        'review': rating.review,
        'new_average': float(product.rating_rate),
    }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_rating(request, product_id):
    """Remove the current user's rating."""
    try:
        rating = ProductRating.objects.get(product_id=product_id, user=request.user)
        rating.delete()
        return Response({'message': 'Rating removed.'})
    except ProductRating.DoesNotExist:
        return Response({'error': 'No rating found.'}, status=404)