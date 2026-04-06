from datetime import datetime, date
from django.db import models, IntegrityError
import random
import string

def generate_appointment_number() -> str:
    today = date.today().strftime("%y%m%d")
    random_part = random.randint(0, 999)
    return f"APPT-{today}-{random_part:03d}"

class Appointment(models.Model):
    appointment_number = models.CharField(
        max_length=20,
        editable=False,
        null=True,
        blank=True
    )

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
    customer_type = models.CharField(max_length=20, default="NEW")

    def save(self, *args, **kwargs):
        if not self.appointment_number:
            for _ in range(10):  # retry max 10 times
                self.appointment_number = generate_appointment_number()
                try:
                    super().save(*args, **kwargs)
                    return
                except IntegrityError as e:
                    if "app_core_appointment.appointment_number" in str(e):
                        print(f"Appointment number generation failed: {self.appointment_number} --> {e}! retrying...")
                        continue
                    else:
                        raise e
                except Exception as e:
                    print(f"Unexpected error during appointment creation: {e}")
                    raise f"Unexpected error during appointment creation: {e}"
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.product_type}"


    
############ generating unique custID and CustomerData Table ############

def generate_customer_id():
    year = datetime.now().strftime("%y")
    random_part = str(random.randint(1000, 9999))
    return f"{year}YB{random_part}"

class Customer(models.Model):
    custID = models.CharField(
        max_length=6,
        unique=True,
        editable=False,
        null=True,
        blank=True
    )
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15, unique=True)
    repeat_count = models.PositiveIntegerField(default=1)
    dateOfRegistration = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.custID:
            for _ in range(10):  # retry max 10 times
                self.custID = generate_customer_id()
                try:
                    super().save(*args, **kwargs)
                    return
                except IntegrityError as e:
                    if "app_core_customer.phone" in str(e):
                        raise IntegrityError # This means the phone number already exists, so we just update the repeat count
                    else:
                        print(f"CUST ID generation failed: {self.custID} --> {e}")
                        continue
                except Exception as e:
                    print(f"Unexpected error during customer save: {e}")
        else:
            super().save(*args, **kwargs)

############## END of CustomerData Table ############