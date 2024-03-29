import si from 'systeminformation';

export async function getSystemInfo(){
  const system = await si.system();
  const os = await si.osInfo();
  const cpu = await si.cpu();
  const mem = await si.mem();
  const memLayout = await si.memLayout();

  return {
    system,
    OS: {
      platform: os.platform,
      distro: os.distro,
      version: os.release,
      architecture: os.arch
    },
    cpu: {
      speedMin: `${cpu.speedMin} Ghz`,
      speedMax: `${cpu.speedMax} Ghz`,
      cores: String(cpu.physicalCores),
      threads: String(cpu.cores)
    },
    memory: {
      total: `${Math.round(mem.total / 1048576)} MB`,
      speed: memLayout[0].clockSpeed !== 0 ? memLayout[0].clockSpeed + 'Mhz' : '-',
      type: memLayout[0].type !== '' ? memLayout[0].type : '-',
      banks: memLayout.length,
      banksInUse: `[${memLayout.map(val => { return val.size !== 0 })}]`
    }
  }
}

export async function getRealtimeInfo(){
  const cpuLoad = await si.currentLoad();
  const cpuSpeed = await si.cpuCurrentSpeed();
  const temp = await si.cpuTemperature();
  const mem = await si.mem();

  return {
    speedCpuAvg: {
      value: `${cpuSpeed.avg} Ghz`
    },
    currentCpuLoad: {
      value: `${(cpuLoad.currentLoad).toFixed(2)} %`
    },
    temperature: {
      board: `${temp.main ? (temp.main).toFixed(1) + '°C' : '-' }`,
      chipset: `${temp.chipset ? (temp.chipset).toFixed(1) + '°C' : '-' }`,
      max: `${temp.max ? (temp.max).toFixed(1) + '°C' : '-' }`
    },
    memoryUsage: {
      value: `${(((Math.round(mem.used) - Math.round(mem.cached)) * 100) / Math.round(mem.total)).toFixed(2)} %`
    }
  }
}