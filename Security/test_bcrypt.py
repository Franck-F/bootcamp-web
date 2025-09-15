import bcrypt
import getpass

def bcrypt_hash(input_str):
    salt = bcrypt.gensalt()
    hashed_password=bcrypt.hashpw(input_str.encode('utf-8'), salt)

    return hashed_password

input_str = getpass.getpass("Enter a password to hash: ")  #cache le nb de caractères

hash_value = bcrypt_hash(input_str)
print("Bcrypt hash:", hash_value)

def verify_password(stored_hash, input_str):
    return bcrypt.checkpw(input_str.encode('utf-8'), stored_hash)

stored_hash = hash_value  # Utiliser le hash généré précédemment

input_str = getpass.getpass("Re-enter the password to verify: ")

if verify_password(stored_hash, input_str):
    print("Password is valid!")
else:
    print("Invalid password.")

