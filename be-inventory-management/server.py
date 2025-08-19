from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src import stream
app = FastAPI()

origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def testing_server():
    return {"status": "Server is running smoothly"}


app.include_router(stream.router)

# running code
# uvicorn server:app --reload