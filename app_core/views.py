from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from .models import Appointment
import json

# Create your views here.
def home(request):
    return render(request, 'app_core/index.html')


def book_appointment(request):
    print("Received appointment booking request")

    if request.method == "POST":
        print("Processing POST request for appointment booking")
        data = json.loads(request.body)
        try:
            name = data.get("name")
            email = data.get("email")
            phone = data.get("contactNo")
            # insurance_type = data.get("insurance")
            product_type = data.get("productType")
            appointment_datetime = data.get("dateTime")
            
            Appointment.objects.create(
                name=name,
                email=email,
                phone=phone,
                # insurance_type=insurance_type,
                product_type=product_type,
                appointment_datetime=appointment_datetime
            )

            return JsonResponse({
                "status": "success",
                "message": "Appointment booked successfully!"
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
            return JsonResponse({
                "status": "error",
                "message": "An unexpected error occurred"
            }, status=500)

    return JsonResponse({"status": "error"})