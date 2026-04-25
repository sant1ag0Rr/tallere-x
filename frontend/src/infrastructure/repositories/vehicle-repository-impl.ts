import type { Vehicle } from "@/domain/models";
import type { VehicleStatus } from "@/domain/constants";
import { delay } from "@/infrastructure/utils/delay";

const NOW = new Date();

const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "veh-001",
    vin: "1HGCM82633A123456",
    plate: "TXA-201",
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    mileage: 32500,
    status: "available",
    assignedClientId: "cli-100",
    maintenanceHistory: [],
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 20).toISOString(),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 20).toISOString()
  },
  {
    id: "veh-002",
    vin: "2C3KA53G76H789012",
    plate: "TXB-311",
    brand: "Mazda",
    model: "CX-5",
    year: 2021,
    mileage: 41000,
    status: "maintenance",
    assignedClientId: "cli-200",
    maintenanceHistory: [
      {
        id: "mnt-01",
        description: "Cambio de pastillas de freno",
        mileage: 40750,
        completedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 30).toISOString()
      }
    ],
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 10).toISOString(),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 5).toISOString()
  },
  {
    id: "veh-003",
    vin: "5NMS3CAD0LH345678",
    plate: "TXC-980",
    brand: "Kia",
    model: "Sportage",
    year: 2023,
    mileage: 18800,
    status: "available",
    assignedClientId: "cli-300",
    maintenanceHistory: [],
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 2).toISOString()
  },
  {
    id: "veh-004",
    vin: "JH4KA8260NC901234",
    plate: "TXD-445",
    brand: "Hyundai",
    model: "Tucson",
    year: 2020,
    mileage: 56300,
    status: "maintenance",
    maintenanceHistory: [
      {
        id: "mnt-02",
        description: "Diagnostico de suspension",
        mileage: 56240,
        completedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 40).toISOString()
      }
    ],
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(NOW.getTime() - 1000 * 60).toISOString()
  }
];

export const vehicleRepository = {
  async listVehicles(status?: VehicleStatus): Promise<Vehicle[]> {
    await delay(800);
    if (!status) {
      return [...MOCK_VEHICLES];
    }

    return MOCK_VEHICLES.filter((vehicle) => vehicle.status === status);
  },

  async getLatestVehicles(limit = 5): Promise<Vehicle[]> {
    await delay(800);
    return [...MOCK_VEHICLES]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  async getVehiclesByClientId(clientId: string): Promise<Vehicle[]> {
    await delay(800);
    return MOCK_VEHICLES.filter((vehicle) => vehicle.assignedClientId === clientId);
  },

  async createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
    await delay(500);
    const newVehicle: Vehicle = {
      id: `veh-${Math.random().toString(36).substr(2, 9)}`,
      vin: data.vin || "",
      plate: data.plate || "",
      brand: data.brand || "",
      model: data.model || "",
      year: data.year || new Date().getFullYear(),
      mileage: data.mileage || 0,
      status: data.status || "available",
      assignedClientId: data.assignedClientId,
      maintenanceHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    MOCK_VEHICLES.unshift(newVehicle);
    return newVehicle;
  }
};
