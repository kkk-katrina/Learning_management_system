import json

data = {"name": "Alice", "age": 25, "email": "alice@example.com"}
json_data = json.dump(data)

print(type(json_data))