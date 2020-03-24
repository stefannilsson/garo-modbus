import ModbusRTU from 'modbus-serial';

export default interface InternalBase {
  modbusClient: ModbusRTU;
  readAllData(): Promise<Object>;
} 