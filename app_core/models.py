from django.db import models


class Appointment(models.Model):

    # INSURANCE_CHOICES = [
    #     ("self", "Self"),
    #     ("corporate", "Corporate")
    # ]

    PRODUCT_CHOICES = [
        ("health", "Health Insurance"),
        ("term", "Term Insurance")
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    # insurance_type = models.CharField(
    #     max_length=20,
    #     choices=INSURANCE_CHOICES
    # )
    product_type = models.CharField(
        max_length=20,
        choices=PRODUCT_CHOICES
    )
    appointment_datetime = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.product_type}"
    
    