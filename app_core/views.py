from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.db.models import F
from django.core.exceptions import ValidationError
from .models import Appointment, Customer
import json
# from YesBima.app_core import models

# Create your views here.
def home(request):
    return render(request, 'app_core/index.html')

def generate_customer_record(**data):
    cleaned_data = {
        "name": data.get("name"),
        "email": data.get("email"),
        "phone": data.get("contactNo")
    }
    try:
        resp = Customer.objects.create(**cleaned_data)
        print(f"Customer record created: {resp}")
        return "UserCreated"
    except IntegrityError:
        Customer.objects.filter(phone=cleaned_data["phone"]).update(repeat_count=F('repeat_count') + 1)
        print(f"Customer record updated: {cleaned_data['phone']}")
        return "UserExists"
    except Exception as e:
        print(f"Error creating customer record: {e}")
        return None

def book_appointment(request):
    print("Received appointment booking request")

    if request.method == "POST":
        print("Processing POST request for appointment booking")
        data = json.loads(request.body)
        customerCreationResult = generate_customer_record(**data)
        if customerCreationResult is None:
            print("Failed to create or update customer record")
        else:
            print(f"Customer creation result: {customerCreationResult}")
        try:
            name = data.get("name")
            email = data.get("email")
            phone = data.get("contactNo")
            # insurance_type = data.get("insurance")
            product_type = data.get("productType")
            appointment_datetime = data.get("dateTime")

            resp = Appointment.objects.create(
                name=name,
                email=email,
                phone=phone,
                # insurance_type=insurance_type,
                product_type=product_type,
                appointment_datetime=appointment_datetime,
                customer_type="REPEATED" if customerCreationResult == "UserExists" else "NEW"
            )

            return JsonResponse({
                "status": "success",
                "message": f"Appointment booked successfully! Appointment Number: {resp.appointment_number}"
            })
        
        except ValidationError as e:
            return JsonResponse({
                "status": "error",
                "message": f"Validation error: {str(e)}"
            }, status=400)
        
        except IntegrityError as e:
            return JsonResponse({
                "status": "error",
                "message": "An appointment with this data already exists"
            }, status=400)
        
        except ValueError as e:
            return JsonResponse({
                "status": "error",
                "message": f"Invalid data format: {str(e)}"
            }, status=400)
        
        except Exception as e:
            print(f"Unexpected error: {e}")
            return JsonResponse({
                "status": "error",
                "message": "An unexpected error occurred"
            }, status=500)

    return JsonResponse({"status": "error"})