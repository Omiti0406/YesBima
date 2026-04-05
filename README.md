# YesBima

YesBima workspace to build the platform---Phase 1

## Project Setup Guide

A step-by-step guide for new developers to set up the YesBima project in their local environment.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Python** (3.8 or higher) - [Download Python](https://www.python.org/downloads/)
- **pip** (Python package manager) - Usually comes with Python
- **Git** (optional, for version control) - [Download Git](https://git-scm.com/)

### Getting Started

#### 1. Clone or Download the Project

```bash
# If using Git
git clone <repository-url>
cd YesBima

# Or extract the project folder if downloaded as ZIP
cd YesBima
```

#### 2. Create a Virtual Environment

A virtual environment isolates project dependencies from your system Python.

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` at the beginning of your terminal prompt when activated.

#### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 4. Apply Database Migrations

```bash
python manage.py migrate
```

#### 5. Create a Superuser (Admin Account)

```bash
python manage.py createsuperuser
```

Follow the prompts to set up your admin credentials (username, email, password).

#### 6. Run the Development Server

```bash
python manage.py runserver
```

The application will be available at `http://localhost:8000`
- Admin panel: `http://localhost:8000/admin`

### Project Structure

```
YesBima/
├── db.sqlite3              # SQLite database
├── manage.py               # Django management script
├── requirements.txt        # Project dependencies
├── app_core/              # Main Django app
│   ├── models.py          # Database models
│   ├── views.py           # View handlers
│   ├── admin.py           # Admin configuration
│   └── migrations/        # Database migrations
├── templates/             # HTML templates
│   └── app_core/
├── static/                # Static files (CSS, JS, images)
│   └── app_core/
└── YesBima/              # Project settings
    ├── settings.py        # Django configuration
    ├── urls.py            # URL routing
    └── wsgi.py            # WSGI configuration
```

### Common Commands

```bash
# Run development server
python manage.py runserver

# Make database changes
python manage.py makemigrations
python manage.py migrate

# Create a superuser
python manage.py createsuperuser

# Access Django shell
python manage.py shell

# Deactivate virtual environment
deactivate
```

### Troubleshooting

**Virtual environment not activating?**
- Ensure you're in the project root directory
- Check that the venv folder exists
- Try running the activation command again

**Dependencies not installing?**
- Ensure your virtual environment is activated (you should see `(venv)` in your terminal)
- Try upgrading pip: `pip install --upgrade pip`
- Clear pip cache: `pip install --upgrade pip --no-cache-dir`

**Database errors?**
- Run `python manage.py migrate` to apply all migrations
- Check if `db.sqlite3` exists in the project root

### Next Steps

1. Read the Django documentation: https://docs.djangoproject.com/
2. Explore the `app_core` app to understand the current models and views
3. Check the `settings.py` file for project configuration
4. Review existing templates and static files in their respective folders

**Happy coding!** 🚀
