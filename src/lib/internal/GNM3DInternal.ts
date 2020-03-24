import GNM3D, { GNM3DDataResponse } from '../GNM3D';
import GaroDeviceDataResponse from '../GaroDeviceDataResponse'
import InternalBase from '../internal/InternalBase';
import ModbusRTU from 'modbus-serial';

export default class GNM3DInternal extends GNM3D implements InternalBase {
  modbusClient: ModbusRTU;
  pollingTimeout: number;

  constructor(device: GNM3D, modbusClient: ModbusRTU, pollingTimeout: number) {
    super(device.modbusSlaveId, device.meterIdentifier, device.meterDescription);

    // extend with ref to modbus client & common poll interval.
    this.modbusClient = modbusClient;
    this.pollingTimeout = pollingTimeout - 10;
  }

  async readAllData(): Promise<GNM3DDataResponse> {
    const parent = this;
    return new Promise(async (resolve, reject) => {
      try {
        parent.modbusClient.setTimeout(parent.pollingTimeout / 2.0); // we can only allow half of polling interval since two reads are being done in GNM3D.
        parent.modbusClient.setID(parent.modbusSlaveId);
    
        // Fetch first 0x01-0x2E (limitation of 50 words per request)
        const r1 = await parent.modbusClient.readHoldingRegisters(0, 46);
        // r1.data
        const r2 = await parent.modbusClient.readHoldingRegisters(46, 34);
        // r2.data
        
          
        const arrayBuffer = r1.data.concat(r2.data);
        if(r1 == undefined || r2 == undefined || arrayBuffer == undefined)
          throw Error("No data from Modbus slave!?");

        const responseData: GNM3DDataResponse = {
          slaveId: parent.modbusSlaveId,
          meterIdentifier: parent.meterIdentifier,
          meterDescription: parent.meterDescription,
          data: parent.parseModbusBuffer(new GaroDeviceDataResponse(arrayBuffer)),
        }
        resolve(responseData);
      }
      catch(e) {
        reject(e);
      }
    });
  }
}