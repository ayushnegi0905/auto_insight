from fastapi import APIRouter
from fastapi import Depends

from pydantic import BaseModel

from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User

from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

router = APIRouter()


# ---------------- REQUEST MODELS ----------------

class RegisterRequest(BaseModel):

    username: str

    password: str


class LoginRequest(BaseModel):

    username: str

    password: str


# ---------------- REGISTER ----------------

@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.username == request.username
    ).first()

    if existing_user:

        return {
            "message": "Username already exists"
        }

    hashed_password = pwd_context.hash(
        request.password
    )

    new_user = User(
        username=request.username,
        password=hashed_password
    )

    db.add(new_user)
    print("BEFORE COMMIT")
    db.commit()
    print("AFTER COMMIT")
    print(new_user.id)
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


# ---------------- LOGIN ----------------

@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == request.username
    ).first()

    if not user:

        return {
            "message": "User not found"
        }

    valid_password = pwd_context.verify(
        request.password,
        user.password
    )

    if not valid_password:

        return {
            "message": "Invalid password"
        }

    return {
        "message": "Login successful",
        "username": user.username,
        "user_id": user.id
    }