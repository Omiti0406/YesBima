from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.db.models import F
from django.core.exceptions import ValidationError
from .models import Appointment, Customer
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from app_core.utils.logger import log_info, log_error, log_debug, log_warning, log_audit
import json

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
        print(f"Response ===>> {resp}")
        log_info(f"Customer record created: {resp.custID}")
        return "UserCreated"
    except IntegrityError:
        log_warning(f"Customer with phone {cleaned_data['phone']} already exists. Updating repeat count.")
        Customer.objects.filter(phone=cleaned_data["phone"]).update(repeat_count=F('repeat_count') + 1)
        log_info(f"Customer record updated: {cleaned_data['phone']}")
        return "UserExists"
    except Exception as e:
        log_error(f"Error creating customer record: {e}")
        return None

def book_appointment(request):
    log_info("Received appointment booking request")

    if request.method == "POST":
        data = json.loads(request.body)

        log_info(f"Checking for existing customer with phone: {data.get('contactNo')}")
        customerCreationResult = generate_customer_record(**data)
        if customerCreationResult is None:
            log_error(f"Failed to create or update customer record: {data.get('name')}/{data.get('contactNo')}")
        else:
            log_info(f"Customer creation result: {customerCreationResult}")
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
                appointment_datetime=timezone.make_aware(parse_datetime(appointment_datetime)),  ####  enabling timezone awareness for datetime field
                customer_type="REPEATED" if customerCreationResult == "UserExists" else "NEW"
            )
            log_info(f"Appointment booked successfully: {resp.appointment_number}")
            return JsonResponse({
                "success": True,
                "message": f"Appointment Number: {resp.appointment_number}"
            }, status=201)
        
        except ValidationError as e:
            log_error(f"Validation error while booking appointment: {e}")
            return JsonResponse({
                "success": False,
                "message": f"Validation error: {str(e)}"
            }, status=400)
        
        # except IntegrityError as e:
        #     log_error(f"Integrity error while booking appointment: {e}")
        #     return JsonResponse({
        #         "status": "error",
        #         "message": "An appointment with this data already exists"
        #     }, status=400)
        
        except ValueError as e:
            log_error(f"Value error while booking appointment: {e}")
            return JsonResponse({
                "success": False,
                "message": f"Invalid data format: {str(e)}"
            }, status=400)
        
        except Exception as e:
            log_error(f"Unexpected error while booking appointment: {e}")
            return JsonResponse({
                "success": False,
                "message": "An unexpected error occurred"
            }, status=500)

    else:
        log_warning(f"Invalid request method: {request.method}")
        return JsonResponse({"success": False, "message": "Invalid request method"})