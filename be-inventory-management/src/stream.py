from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import time, json, random, uuid

router = APIRouter()

@router.get("/tester")
def testthis():
    return {"Fun": 23}

@router.get("/stream")
def update_stream():
    def event_generator():
        while True:
            entry = {
                "id": str(uuid.uuid4()),
                "count": random.randint(1,6),
                "time": time.strftime("%H:%M:%S"),
                "status": "Passed"
            }
            yield f"data: {json.dumps(entry)}\n\n"
            time.sleep(1)
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/perminute_stream")
def update_perminute():
    def perminute_generator():

        while True:
            buffer = 0
            counter = 0
            start_time = time.strftime("%Y-%m-%d %H:%M:%S")  # mark window start

            for _ in range(60):
                buffer += random.randint(1,6)
                counter += 1
                time.sleep(1)
            
            entry = {
                "count": buffer,
                "timestamp": start_time,
                "samples": counter,
                "status": "Aggregated"
            }
            yield f"data: {json.dumps(entry)}\n\n"
    
    return StreamingResponse(perminute_generator(), media_type="text/event-stream")
