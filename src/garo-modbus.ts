/* eslint-disable no-unused-vars */
import Debug from 'debug'
import ModbusRTU from 'modbus-serial'
import { SerialPortOptions } from 'modbus-serial/ModbusRTU'

import { EventEmitter } from 'events';
import GaroDeviceBase from './lib/GaroDeviceBase';
import InternalBase from './lib/internal/InternalBase'

// Garo Devices
import GNM3D from './lib/GNM3D';
import GNM3DInternal from './lib/internal/GNM3DInternal';

const err = Debug('garo:err');
const verbose = Debug('garo:verbose');

interface PollerOptions {
  autoConnect: boolean;
  connectTimeout: number;
  serialPortOptions: SerialPortOptions,
}

export = class GaroPoller extends EventEmitter {
  serialPath: string;
  serialBaudRate: number;
  modbusClient: ModbusRTU;
  options: PollerOptions;
  pollerInterval?: NodeJS.Timeout;
  pollCycle: number;
  meters: [InternalBase?] = [];

  static Devices = {
    GNM3D,
  };
  /**
   * @param serialPath Path to serial device
   * @param baudRate Serial baud rate (e.g. 115200)
   * @param devices An array of meters implementing 'GaroDeviceBase' interface.
   * @param pollingInterval Number of milliseconds between polls.
   * @param options Additional poller options
   * @param 
   */
  constructor(serialPath: string,
    baudRate: number,
    devices: [GaroDeviceBase],
    pollingInterval: number,
    options: PollerOptions) {
      super();

    this.serialPath = serialPath;
    this.serialBaudRate = baudRate;
    this.modbusClient = new ModbusRTU();
    this.pollCycle = pollingInterval;
    this.options = options;

    // Enrich device instances with Modbus Client details.
    devices.map((device) => {
      if(device instanceof GNM3D) {
        this.meters.push(
          new GNM3DInternal(
            device,
            this.modbusClient,
            (pollingInterval / devices.length) // give each meter their share of the total polling interval.
          )
        );
      }
    });

    verbose('Meters registerered:');
    verbose(this.meters);
    verbose('----');
    verbose(`GaroPoller initlized successfully '${this.meters}'!`);
  }

  public connect():Promise<void> {
    verbose(`Connecting to path ${this.serialPath}...`);
    return new Promise((resolve) => {
      this.modbusClient.connectRTUBuffered(this.serialPath, { baudRate: this.serialBaudRate }, () => {
      verbose('Modbus client connected!');
      resolve();
      });
    });
  }

  public startPolling():void {
    verbose('Starting poller...');
    const parent = this;
    this.pollerInterval = setInterval(async () => {
      verbose('Poll!');
      for(let midx = 0; midx < parent.meters.length; midx++) {
        const meterData = await (parent.meters[midx]!).readAllData();
        verbose(`Read (idx: ${midx}): `);
        verbose(JSON.stringify(meterData));
        parent.emit('data', meterData);
      }
    }, this.pollCycle);
  }

  public stopPolling(): void {
    verbose('Stopping poller...');
    if (this.pollerInterval) {
      clearInterval(this.pollerInterval);
    }
  }
};