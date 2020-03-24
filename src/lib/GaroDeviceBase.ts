import GaroDeviceDataResponse from './GaroDeviceDataResponse';
import ModbusRTU from "modbus-serial";

export default interface GaroDeviceBase {
  meterDescription: string;
  modbusSlaveId: number;
  parseModbusBuffer: Object;
  // readAllData(): Object;
}