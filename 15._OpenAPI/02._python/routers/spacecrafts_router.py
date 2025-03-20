from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class SpaceCraft(BaseModel):
    id: int
    name: str

class SpaceCraftRequestModel(BaseModel):
    name: str

def base(number: int):
    return number

spacecrafts = [
    SpaceCraft(id=1, name="Apollo 13"),
    SpaceCraft(id=2, name="Challenger"),
    SpaceCraft(id=3, name="Enterprise")
]

@router.get('/api/spacecrafts', tags=["Spacecraft"], response_model=list[SpaceCraft])
def get_spacecrafts():
    return spacecrafts

@router.get('/api/spacecrafts/{spacecraft_id}', tags=["Spacecraft"], response_model=SpaceCraft)
def get_spacecraft_by_id(spacecraft_id: int):
    for spacecraft in spacecrafts:
        if spacecraft.id == spacecraft_id:
            return spacecraft
    raise HTTPException(status_code=404, detail="Spacecraft not found")

@router.post('/api/spacecrafts', tags=["spacecraft"], response_model=SpaceCraft)
def create_spacecraft(spacecraft: SpaceCraftRequestModel):
    SpaceCraft(id=4, name=spacecraft.name)
    spacecrafts.append(spacecraft)
    return spacecraft