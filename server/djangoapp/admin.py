from django.contrib import admin
from .models import CarMake, CarModel

# Register CarModelInline so CarModel can be edited within CarMake


class CarModelInline(admin.TabularInline):
    model = CarModel
    extra = 1

# Register CarMakeAdmin with CarModelInline


class CarMakeAdmin(admin.ModelAdmin):
    inlines = [CarModelInline]
    list_display = ('name', 'description')

# Register CarModelAdmin


class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'car_make', 'type', 'year', 'dealer_id')
    list_filter = ['type', 'year']
    search_fields = ['name', 'car_make__name']


admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)
