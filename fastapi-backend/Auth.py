import jwt
import datetime

SECRET_KEY = 'your_secret_key'

# Authentication
def authenticate(username, password):
    # Replace this with your authentication logic
    if username == 'admin' and password == 'password':
        return True
    return False

# Token Generation
def generate_token(username):
    payload = {
        'username': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30) # Token expiration time
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

# Token Verification
def verify_token(token):
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return data
    except jwt.ExpiredSignatureError:
        return {'error': 'Token has expired'}, 401
    except jwt.InvalidTokenError:
        return {'error': 'Invalid token'}, 401

# Authorization
def authorize(token):
    # Authorization logic
    # For example, check if the user has the necessary permissions
    # You can access the decoded token data with `data`
    data = verify_token(token)
    if 'error' in data:
        return data, 401
    # Your authorization logic here
    return {'message': 'Access granted'}

# Response
def create_response(message, status_code=200):
    return {'message': message}, status_code
