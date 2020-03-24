/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-multi-spaces */
/* eslint-disable key-spacing */

import GaroDeviceBase from './GaroDeviceBase';
import GaroDeviceDataResponse, { INT16, INT32 } from './GaroDeviceDataResponse'

export default class GNM3D /*implements GaroDeviceBase */{
  modbusSlaveId: number;

  meterIdentifier: string;
  meterDescription: string;
  
  constructor(slaveId: number, meterIdentifier: string, meterDescription: string) {
    this.modbusSlaveId = slaveId;
    this.meterIdentifier = meterIdentifier;
    this.meterDescription = meterDescription;
  }

  parseModbusBuffer(b: GaroDeviceDataResponse) : GNM3DModbusSpecification {
    return {
      // First Modbus poll (23 pcs of 2 WORD registers)
      V_L1_N:             b.shiftNextINT32() / 10.0,      // Value weight: Volt*10
      V_L2_N:             b.shiftNextINT32() / 10.0,      // Value weight: Volt*10
      V_L3_N:             b.shiftNextINT32() / 10.0,      // Value weight: Volt*10
      V_L1_L2:            b.shiftNextINT32() / 10.0,      // Value weight: Volt*10
      V_L2_L3:            b.shiftNextINT32() / 10.0,      // Value weight: Volt*10
      V_L3_L1:            b.shiftNextINT32() / 10.0,      // Value weight: Volt*10

      A_L1:               b.shiftNextINT32() / 1000.0,    // Value weight: Ampere*1000
      A_L2:               b.shiftNextINT32() / 1000.0,    // Value weight: Ampere*1000
      A_L3:               b.shiftNextINT32() / 1000.0,    // Value weight: Ampere*1000

      W_L1:               b.shiftNextINT32() / 10.0,      // Value weight: Watt*10
      W_L2:               b.shiftNextINT32() / 10.0,      // Value weight: Watt*10
      W_L3:               b.shiftNextINT32() / 10.0,      // Value weight: Watt*10

      VA_L1:              b.shiftNextINT32() / 10.0,      // Value weight: VA*10
      VA_L2:              b.shiftNextINT32() / 10.0,      // Value weight: VA*10
      VA_L3:              b.shiftNextINT32() / 10.0,      // Value weight: VA*10

      VAr_L1:             b.shiftNextINT32() / 10.0,      // Value weight: var*10
      VAr_L2:             b.shiftNextINT32() / 10.0,      // Value weight: var*10
      VAr_L3:             b.shiftNextINT32() / 10.0,      // Value weight: var*10

      V_L_N_sys:          b.shiftNextINT32() / 10.0,      // Value weight: Volt*10
      V_L_L_sys:          b.shiftNextINT32() / 10.0,      // Value weight: Volt*10

      W_sys:              b.shiftNextINT32() / 10.0,      // Value weight: Watt*10
      VA_sys:             b.shiftNextINT32() / 10.0,      // Value weight: VA*10
      var_sys:            b.shiftNextINT32() / 10.0,      // Value weight: var*10

      // Second Modbus poll (34 pcs 1 WORD registers)
      PF_L1 :             b.shiftNextINT16() / 1000.0,    // Negative values correspond to exported active power, positive values correspond to imported active power. Value weight: PF*1000
      PF_L2 :             b.shiftNextINT16() / 1000.0,    // Negative values correspond to exported active power, positive values correspond to imported active power. Value weight: PF*1000
      PF_L3 :             b.shiftNextINT16() / 1000.0,    // Negative values correspond to exported active power, positive values correspond to imported active power. Value weight: PF*1000
      PF_sys:             b.shiftNextINT16() / 1000.0,    // Negative values correspond to exported active power, positive values correspond to imported active power. Value weight: PF*1000

      PhaseSequence:      b.shiftNextINT16(),             // The value –1 corresponds to L1-L3-L2 sequence, the value 0 corresponds to L1-L2- L3 sequence. The phase sequence value is meaningful only in a 3-phase system.

      Hz:                 b.shiftNextINT16() / 10.0,      // Value weight: Hz*10

      kWh_TOT:            b.shiftNextINT32() / 10.0,      // Value weight: kWh*10   (+)
      kVArh_TOT:          b.shiftNextINT32() / 10.0,      // Value weight: kvarh*10 (+)
      W_dmd:              b.shiftNextINT32() / 10.0,      // Value weight: Watt*10
      W_dmd_peak:         b.shiftNextINT32() / 10.0,      // Value weight: Watt*10
      kWh_PARTIAL:        b.shiftNextINT32() / 10.0,      // Value weight: kWh*10   (+)
      kVArh_PARTIAL:      b.shiftNextINT32() / 10.0,      // Value weight: kvarh*10 (+)
      kWh_L1:             b.shiftNextINT32() / 10.0,      // Value weight: kWh*10   (+)
      kWh_L2:             b.shiftNextINT32() / 10.0,      // Value weight: kWh*10   (+)
      kWh_L3:             b.shiftNextINT32() / 10.0,      // Value weight: kWh*10   (+)
      kWh_t1:             b.shiftNextINT32() / 10.0,      // Value weight: kWh*10   (+)
      kWh_t2:             b.shiftNextINT32() / 10.0,      // Value weight: kWh*10   (+)

      kWh_NEGATIVE_TOT:   b.shiftNextINT32() / 10.0,      // Value weight: kWh*10
      kvarh_NEGATIVE_TOT: b.shiftNextINT32() / 10.0,      // Value weight: kvarh*10

      Run_Hour_Meter:     b.shiftNextINT32() / 100.0,     // Value weight: hours*100, only GNM3T series
    };
  }
}

export interface GNM3DDataResponse {
  slaveId: number,
  meterIdentifier: string,
  meterDescription: string,
  data: GNM3DModbusSpecification
}

// GNM3DModbus Specification
export interface GNM3DModbusSpecification {
  V_L1_N :            INT32;      // Value weight: Volt*10
  V_L2_N :            INT32;      // Value weight: Volt*10
  V_L3_N :            INT32;      // Value weight: Volt*10
  V_L1_L2:            INT32;      // Value weight: Volt*10
  V_L2_L3:            INT32;      // Value weight: Volt*10
  V_L3_L1:            INT32;      // Value weight: Volt*10

  A_L1:               INT32;      // Value weight: Ampere*1000
  A_L2:               INT32;      // Value weight: Ampere*1000
  A_L3:               INT32;      // Value weight: Ampere*1000

  W_L1:               INT32;      // Value weight: Watt*10
  W_L2:               INT32;      // Value weight: Watt*10
  W_L3:               INT32;      // Value weight: Watt*10

  VA_L1:              INT32;      // Value weight: VA*10
  VA_L2:              INT32;      // Value weight: VA*10
  VA_L3:              INT32;      // Value weight: VA*10

  VAr_L1:             INT32;      // Value weight: var*10
  VAr_L2:             INT32;      // Value weight: var*10
  VAr_L3:             INT32;      // Value weight: var*10

  V_L_N_sys:          INT32;      // Value weight: Volt*10
  V_L_L_sys:          INT32;      // Value weight: Volt*10

  W_sys:              INT32;      // Value weight: Watt*10
  VA_sys:             INT32;      // Value weight: VA*10
  var_sys:            INT32;      // Value weight: var*10

  PF_L1 :             INT16;      // Negative values correspond to exported active power, positive values correspond to imported active power. Value weight: PF*1000 
  PF_L2 :             INT16;      // Negative values correspond to exported active power, positive values correspond to imported active power. Value weight: PF*1000 
  PF_L3 :             INT16;      // Negative values correspond to exported active power, positive values correspond to imported active power. Value weight: PF*1000 
  PF_sys:             INT16;      // Negative values correspond to exported active power, positive values correspond to imported active power. Value weight: PF*1000 

  PhaseSequence:      INT16;      // The value –1 corresponds to L1-L3-L2 sequence, the value 0 corresponds to L1-L2- L3 sequence. The phase sequence value is meaningful only in a 3-phase system.

  Hz:                 INT16;      // Value weight: Hz*10
  kWh_TOT:            INT32;      // Value weight: kWh*10   (+)
  kVArh_TOT:          INT32;      // Value weight: kvarh*10 (+)
  W_dmd:              INT32;      // Value weight: Watt*10
  W_dmd_peak:         INT32;      // Value weight: Watt*10
  kWh_PARTIAL:        INT32;      // Value weight: kWh*10   (+)
  kVArh_PARTIAL:      INT32;      // Value weight: kvarh*10 (+)
  kWh_L1:             INT32;      // Value weight: kWh*10   (+)
  kWh_L2:             INT32;      // Value weight: kWh*10   (+)
  kWh_L3:             INT32;      // Value weight: kWh*10   (+)
  kWh_t1:             INT32;      // Value weight: kWh*10   (+)
  kWh_t2:             INT32;      // Value weight: kWh*10   (+)

  kWh_NEGATIVE_TOT:   INT32;      // Value weight: kWh*10   (-)

  kvarh_NEGATIVE_TOT: INT32;      // Value weight: kvarh*10 (-)

  Run_Hour_Meter:     INT32;      // Value weight: hours*100, only GNM3T series
}
