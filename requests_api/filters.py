import django_filters

from .models import Request


class RequestFilter(django_filters.FilterSet):
    created_date = django_filters.DateFilter(
        field_name='created_at',
        lookup_expr='date'
    )

    class Meta:
        model = Request
        fields = [
            'status',
            'priority',
            'created_date',
        ]