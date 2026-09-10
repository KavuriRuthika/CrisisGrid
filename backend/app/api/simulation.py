from fastapi import APIRouter
from app.schemas import SimulationRequest, SimulationResponse
from app.services.simulation_service import run_disaster_simulation

router = APIRouter(prefix="/simulation", tags=["Crisis Simulation"])

@router.post("/run", response_model=SimulationResponse)
def run_simulation(req: SimulationRequest):
    result = run_disaster_simulation(
        disaster_type=req.disaster_type,
        rainfall_mm=req.rainfall_mm,
        water_level_m=req.water_level_m,
        population_density=req.population_density
    )
    return SimulationResponse(**result)
