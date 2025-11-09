import * as THREE from "three"

// ============================================================================
// CONSTANTES PARA EL MAPA 3D
// ============================================================================

export const MARKER_COLORS: Record<string, string> = {
  entrance: "#10b981",
  exit: "#ef4444",
  emergency_exit: "#f97316",
  stage: "#9333ea",
  backstage: "#7c3aed",
  booth: "#06b6d4",
  sponsor_booth: "#0ea5e9",
  info_booth: "#3b82f6",
  merchandise: "#8b5cf6",
  photo_booth: "#ec4899",
  food: "#f59e0b",
  bar: "#f97316",
  kitchen: "#ea580c",
  bathroom: "#8b5cf6",
  accessible_bathroom: "#a855f7",
  cloakroom: "#c026d3",
  atm: "#14b8a6",
  charging_station: "#eab308",
  security: "#dc2626",
  medical: "#ef4444",
  info: "#3b82f6",
  seating: "#6366f1",
  standing_area: "#8b5cf6",
  vip_seating: "#f59e0b",
  vip_area: "#eab308",
  press_area: "#06b6d4",
  parking: "#64748b",
  registration: "#10b981",
  stairs: "#71717a",
  elevator: "#78716c",
  escalator: "#737373",
  ramp: "#84cc16",
}

// ============================================================================
// FUNCIONES PARA CREAR OBJETOS 3D REALISTAS
// ============================================================================

function createCar(color: string): THREE.Group {
  const car = new THREE.Group()

  // Carrocería principal
  const bodyGeometry = new THREE.BoxGeometry(1.8, 0.6, 4)
  const bodyMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.8, roughness: 0.2 })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.position.y = 0.4
  car.add(body)

  // Cabina
  const cabinGeometry = new THREE.BoxGeometry(1.6, 0.5, 2)
  const cabinMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.8, roughness: 0.2 })
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial)
  cabin.position.y = 0.95
  cabin.position.z = -0.3
  car.add(cabin)

  // Ventanas
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.6,
  })
  const windowGeometry = new THREE.BoxGeometry(1.5, 0.4, 1.8)
  const windows = new THREE.Mesh(windowGeometry, windowMaterial)
  windows.position.y = 0.95
  windows.position.z = -0.3
  car.add(windows)

  // Ruedas
  const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16)
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 })

  const wheelPositions = [
    { x: -0.9, z: 1.2 },
    { x: 0.9, z: 1.2 },
    { x: -0.9, z: -1.2 },
    { x: 0.9, z: -1.2 },
  ]

  wheelPositions.forEach((pos) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel.rotation.z = Math.PI / 2
    wheel.position.set(pos.x, 0.3, pos.z)
    car.add(wheel)
  })

  return car
}

function createDoor(color: string, isOpen = false): THREE.Group {
  const doorGroup = new THREE.Group()

  // Marco de la puerta
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.7 })

  // Postes verticales
  const postGeometry = new THREE.BoxGeometry(0.15, 2.2, 0.15)
  const leftPost = new THREE.Mesh(postGeometry, frameMaterial)
  leftPost.position.set(-0.6, 1.1, 0)
  doorGroup.add(leftPost)

  const rightPost = new THREE.Mesh(postGeometry, frameMaterial)
  rightPost.position.set(0.6, 1.1, 0)
  doorGroup.add(rightPost)

  // Dintel superior
  const lintelGeometry = new THREE.BoxGeometry(1.35, 0.15, 0.15)
  const lintel = new THREE.Mesh(lintelGeometry, frameMaterial)
  lintel.position.set(0, 2.2, 0)
  doorGroup.add(lintel)

  // Puerta
  const doorGeometry = new THREE.BoxGeometry(1.2, 2, 0.1)
  const doorMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.3 })
  const door = new THREE.Mesh(doorGeometry, doorMaterial)
  door.position.set(isOpen ? -0.6 : 0, 1, 0)
  if (isOpen) {
    door.rotation.y = Math.PI / 2
  }
  doorGroup.add(door)

  // Manija
  const handleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 8)
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 })
  const handle = new THREE.Mesh(handleGeometry, handleMaterial)
  handle.rotation.z = Math.PI / 2
  handle.position.set(isOpen ? -0.5 : 0.5, 1, 0.1)
  doorGroup.add(handle)

  return doorGroup
}

function createStairs(color: string): THREE.Group {
  const stairsGroup = new THREE.Group()
  const steps = 8
  const stepHeight = 0.2
  const stepDepth = 0.4
  const stepWidth = 2

  const stepMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.8 })

  for (let i = 0; i < steps; i++) {
    const stepGeometry = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth)
    const step = new THREE.Mesh(stepGeometry, stepMaterial)
    step.position.set(0, i * stepHeight, -i * stepDepth)
    stairsGroup.add(step)
  }

  // Barandas
  const railMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 })
  const railGeometry = new THREE.CylinderGeometry(0.05, 0.05, steps * stepHeight, 8)

  const leftRail = new THREE.Mesh(railGeometry, railMaterial)
  leftRail.position.set(-stepWidth / 2, (steps * stepHeight) / 2, (-steps * stepDepth) / 2)
  stairsGroup.add(leftRail)

  const rightRail = new THREE.Mesh(railGeometry, railMaterial)
  rightRail.position.set(stepWidth / 2, (steps * stepHeight) / 2, (-steps * stepDepth) / 2)
  stairsGroup.add(rightRail)

  return stairsGroup
}

function createBoothTable(color: string): THREE.Group {
  const boothGroup = new THREE.Group()

  // Mesa larga
  const tableTopGeometry = new THREE.BoxGeometry(3, 0.1, 1)
  const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.6 })
  const tableTop = new THREE.Mesh(tableTopGeometry, tableMaterial)
  tableTop.position.y = 0.75
  boothGroup.add(tableTop)

  // Patas de la mesa
  const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.75, 8)
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.7 })

  const legPositions = [
    { x: -1.3, z: -0.4 },
    { x: -1.3, z: 0.4 },
    { x: 1.3, z: -0.4 },
    { x: 1.3, z: 0.4 },
  ]

  legPositions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial)
    leg.position.set(pos.x, 0.375, pos.z)
    boothGroup.add(leg)
  })

  // Sillas (2 detrás de la mesa)
  const chairPositions = [
    { x: -0.8, z: -0.8 },
    { x: 0.8, z: -0.8 },
  ]

  chairPositions.forEach((pos) => {
    const chair = createChair(color)
    chair.position.set(pos.x, 0, pos.z)
    boothGroup.add(chair)
  })

  // Mantel o banner con color del stand
  const bannerGeometry = new THREE.BoxGeometry(3, 0.6, 0.05)
  const bannerMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
  const banner = new THREE.Mesh(bannerGeometry, bannerMaterial)
  banner.position.set(0, 0.4, 0.5)
  boothGroup.add(banner)

  return boothGroup
}

function createChair(color: string): THREE.Group {
  const chairGroup = new THREE.Group()

  // Asiento
  const seatGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.5)
  const chairMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  const seat = new THREE.Mesh(seatGeometry, chairMaterial)
  seat.position.y = 0.45
  chairGroup.add(seat)

  // Respaldo
  const backGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.1)
  const back = new THREE.Mesh(backGeometry, chairMaterial)
  back.position.set(0, 0.7, -0.2)
  chairGroup.add(back)

  // Patas
  const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8)
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7 })

  const legPositions = [
    { x: -0.2, z: -0.2 },
    { x: -0.2, z: 0.2 },
    { x: 0.2, z: -0.2 },
    { x: 0.2, z: 0.2 },
  ]

  legPositions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial)
    leg.position.set(pos.x, 0.225, pos.z)
    chairGroup.add(leg)
  })

  return chairGroup
}

function createBathroom(color: string, accessible = false): THREE.Group {
  const bathroomGroup = new THREE.Group()

  // Inodoro
  const toiletBase = new THREE.CylinderGeometry(0.25, 0.3, 0.4, 16)
  const toiletMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 })
  const toilet = new THREE.Mesh(toiletBase, toiletMaterial)
  toilet.position.set(0, 0.2, 0)
  bathroomGroup.add(toilet)

  // Tapa del inodoro
  const lidGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16)
  const lid = new THREE.Mesh(lidGeometry, toiletMaterial)
  lid.position.set(0, 0.45, 0)
  bathroomGroup.add(lid)

  // Tanque
  const tankGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.2)
  const tank = new THREE.Mesh(tankGeometry, toiletMaterial)
  tank.position.set(0, 0.65, -0.25)
  bathroomGroup.add(tank)

  // Lavabo
  const sinkGeometry = new THREE.CylinderGeometry(0.25, 0.2, 0.15, 16)
  const sink = new THREE.Mesh(sinkGeometry, toiletMaterial)
  sink.position.set(0.8, 0.8, 0)
  bathroomGroup.add(sink)

  // Pedestal del lavabo
  const pedestalGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.8, 16)
  const pedestal = new THREE.Mesh(pedestalGeometry, toiletMaterial)
  pedestal.position.set(0.8, 0.4, 0)
  bathroomGroup.add(pedestal)

  // Grifo
  const faucetMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.1 })
  const faucetGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8)
  const faucet = new THREE.Mesh(faucetGeometry, faucetMaterial)
  faucet.position.set(0.8, 0.95, 0)
  bathroomGroup.add(faucet)

  // Símbolo de accesibilidad si es necesario
  if (accessible) {
    const signGeometry = new THREE.CircleGeometry(0.3, 32)
    const signMaterial = new THREE.MeshStandardMaterial({ color: 0x0066cc })
    const sign = new THREE.Mesh(signGeometry, signMaterial)
    sign.position.set(0, 1.5, 0.5)
    sign.rotation.y = Math.PI
    bathroomGroup.add(sign)
  }

  return bathroomGroup
}

function createStage(color: string): THREE.Group {
  const stageGroup = new THREE.Group()

  // Plataforma principal
  const platformGeometry = new THREE.BoxGeometry(6, 0.8, 4)
  const platformMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.2 })
  const platform = new THREE.Mesh(platformGeometry, platformMaterial)
  platform.position.y = 0.4
  stageGroup.add(platform)

  // Escalones de acceso
  const stepGeometry = new THREE.BoxGeometry(1, 0.2, 0.8)
  const stepMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7 })
  const step1 = new THREE.Mesh(stepGeometry, stepMaterial)
  step1.position.set(-2.5, 0.1, 2.5)
  stageGroup.add(step1)

  const step2 = new THREE.Mesh(stepGeometry, stepMaterial)
  step2.position.set(-2.5, 0.3, 2.5)
  stageGroup.add(step2)

  // Cortinas laterales
  const curtainGeometry = new THREE.BoxGeometry(0.2, 3, 1)
  const curtainMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.8 })

  const leftCurtain = new THREE.Mesh(curtainGeometry, curtainMaterial)
  leftCurtain.position.set(-3, 2.3, 0)
  stageGroup.add(leftCurtain)

  const rightCurtain = new THREE.Mesh(curtainGeometry, curtainMaterial)
  rightCurtain.position.set(3, 2.3, 0)
  stageGroup.add(rightCurtain)

  // Luces del escenario
  const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 0.5,
  })
  const lightGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.3, 8)

  for (let i = -2; i <= 2; i++) {
    const light = new THREE.Mesh(lightGeometry, lightMaterial)
    light.position.set(i * 1.2, 3.5, -1.5)
    light.rotation.x = Math.PI / 4
    stageGroup.add(light)
  }

  // Micrófono
  const micStandGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8)
  const micStandMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 })
  const micStand = new THREE.Mesh(micStandGeometry, micStandMaterial)
  micStand.position.set(0, 1.55, 0)
  stageGroup.add(micStand)

  const micGeometry = new THREE.SphereGeometry(0.08, 16, 16)
  const micMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.9 })
  const mic = new THREE.Mesh(micGeometry, micMaterial)
  mic.position.set(0, 2.3, 0)
  stageGroup.add(mic)

  return stageGroup
}

function createBar(color: string): THREE.Group {
  const barGroup = new THREE.Group()

  // Mostrador
  const counterGeometry = new THREE.BoxGeometry(3, 0.1, 1.2)
  const counterMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.3, metalness: 0.4 })
  const counter = new THREE.Mesh(counterGeometry, counterMaterial)
  counter.position.y = 1
  barGroup.add(counter)

  // Base del mostrador
  const baseGeometry = new THREE.BoxGeometry(3, 1, 1)
  const baseMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.set(0, 0.5, 0)
  barGroup.add(base)

  // Estante trasero
  const shelfGeometry = new THREE.BoxGeometry(3, 1.5, 0.3)
  const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.6 })
  const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial)
  shelf.position.set(0, 1.5, -0.6)
  barGroup.add(shelf)

  // Botellas en el estante
  const bottleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8)
  const bottleColors = [0x00ff00, 0xff6600, 0xffff00, 0x8b4513, 0xff0000]

  for (let i = 0; i < 5; i++) {
    const bottleMaterial = new THREE.MeshStandardMaterial({
      color: bottleColors[i],
      transparent: true,
      opacity: 0.7,
      roughness: 0.2,
      metalness: 0.1,
    })
    const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial)
    bottle.position.set(-1 + i * 0.5, 1.65, -0.55)
    barGroup.add(bottle)
  }

  // Vasos en el mostrador
  const glassGeometry = new THREE.CylinderGeometry(0.06, 0.05, 0.15, 8)
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
    metalness: 0.1,
  })

  for (let i = 0; i < 3; i++) {
    const glass = new THREE.Mesh(glassGeometry, glassMaterial)
    glass.position.set(-0.6 + i * 0.6, 1.13, 0.3)
    barGroup.add(glass)
  }

  // Taburetes de bar
  for (let i = 0; i < 3; i++) {
    const stool = createBarStool(color)
    stool.position.set(-1 + i, 0, 0.8)
    barGroup.add(stool)
  }

  return barGroup
}

function createBarStool(color: string): THREE.Group {
  const stoolGroup = new THREE.Group()

  // Asiento
  const seatGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.08, 16)
  const seatMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  const seat = new THREE.Mesh(seatGeometry, seatMaterial)
  seat.position.y = 0.7
  stoolGroup.add(seat)

  // Pata central
  const legGeometry = new THREE.CylinderGeometry(0.04, 0.06, 0.7, 8)
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.3 })
  const leg = new THREE.Mesh(legGeometry, legMaterial)
  leg.position.y = 0.35
  stoolGroup.add(leg)

  // Base
  const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16)
  const base = new THREE.Mesh(baseGeometry, legMaterial)
  base.position.y = 0.025
  stoolGroup.add(base)

  return stoolGroup
}

function createElevator(color: string): THREE.Group {
  const elevatorGroup = new THREE.Group()

  // Cabina
  const cabinGeometry = new THREE.BoxGeometry(1.5, 2.2, 1.5)
  const cabinMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.6, roughness: 0.3 })
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial)
  cabin.position.y = 1.1
  elevatorGroup.add(cabin)

  // Puertas
  const doorGeometry = new THREE.BoxGeometry(0.7, 2, 0.05)
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 })

  const leftDoor = new THREE.Mesh(doorGeometry, doorMaterial)
  leftDoor.position.set(-0.35, 1, 0.76)
  elevatorGroup.add(leftDoor)

  const rightDoor = new THREE.Mesh(doorGeometry, doorMaterial)
  rightDoor.position.set(0.35, 1, 0.76)
  elevatorGroup.add(rightDoor)

  // Panel de botones
  const panelGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.05)
  const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
  const panel = new THREE.Mesh(panelGeometry, panelMaterial)
  panel.position.set(0.6, 1.2, 0.76)
  elevatorGroup.add(panel)

  // Botones
  const buttonGeometry = new THREE.CircleGeometry(0.03, 16)
  const buttonMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 0.3,
  })

  for (let i = 0; i < 3; i++) {
    const button = new THREE.Mesh(buttonGeometry, buttonMaterial)
    button.position.set(0.6, 1.4 - i * 0.15, 0.78)
    elevatorGroup.add(button)
  }

  return elevatorGroup
}

function createATM(color: string): THREE.Group {
  const atmGroup = new THREE.Group()

  // Cuerpo principal
  const bodyGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.4)
  const bodyMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.3 })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.position.y = 0.75
  atmGroup.add(body)

  // Pantalla
  const screenGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.05)
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x001a33,
    emissive: 0x0066cc,
    emissiveIntensity: 0.3,
  })
  const screen = new THREE.Mesh(screenGeometry, screenMaterial)
  screen.position.set(0, 1.1, 0.21)
  atmGroup.add(screen)

  // Teclado
  const keypadGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.05)
  const keypadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
  const keypad = new THREE.Mesh(keypadGeometry, keypadMaterial)
  keypad.position.set(0, 0.6, 0.21)
  atmGroup.add(keypad)

  // Ranura para tarjeta
  const slotGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.05)
  const slotMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })
  const slot = new THREE.Mesh(slotGeometry, slotMaterial)
  slot.position.set(0, 0.3, 0.21)
  atmGroup.add(slot)

  // Dispensador de efectivo
  const dispenserGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.05)
  const dispenser = new THREE.Mesh(dispenserGeometry, slotMaterial)
  dispenser.position.set(0, 0.15, 0.21)
  atmGroup.add(dispenser)

  return atmGroup
}

function createChargingStation(color: string): THREE.Group {
  const stationGroup = new THREE.Group()

  // Poste principal
  const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16)
  const poleMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.4 })
  const pole = new THREE.Mesh(poleGeometry, poleMaterial)
  pole.position.y = 0.75
  stationGroup.add(pole)

  // Panel superior
  const panelGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.1)
  const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
  const panel = new THREE.Mesh(panelGeometry, panelMaterial)
  panel.position.set(0, 1.2, 0)
  stationGroup.add(panel)

  // Pantalla
  const displayGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.05)
  const displayMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x00ff00,
    emissiveIntensity: 0.4,
  })
  const display = new THREE.Mesh(displayGeometry, displayMaterial)
  display.position.set(0, 1.3, 0.06)
  stationGroup.add(display)

  // Cables (4 puertos)
  const cableGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8)
  const cableMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })

  const cablePositions = [
    { x: -0.15, y: 0.9 },
    { x: -0.05, y: 0.9 },
    { x: 0.05, y: 0.9 },
    { x: 0.15, y: 0.9 },
  ]

  cablePositions.forEach((pos) => {
    const cable = new THREE.Mesh(cableGeometry, cableMaterial)
    cable.position.set(pos.x, pos.y, 0.05)
    stationGroup.add(cable)

    // Conector
    const connectorGeometry = new THREE.BoxGeometry(0.04, 0.08, 0.04)
    const connectorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const connector = new THREE.Mesh(connectorGeometry, connectorMaterial)
    connector.position.set(pos.x, pos.y - 0.25, 0.05)
    stationGroup.add(connector)
  })

  // Base
  const baseGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.1, 16)
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = 0.05
  stationGroup.add(base)

  return stationGroup
}

function createSeatingArea(color: string, isVIP = false): THREE.Group {
  const seatingGroup = new THREE.Group()

  // Crear filas de sillas
  const rows = 3
  const seatsPerRow = 4

  for (let row = 0; row < rows; row++) {
    for (let seat = 0; seat < seatsPerRow; seat++) {
      const chair = createChair(isVIP ? "#ffd700" : color)
      chair.position.set((seat - seatsPerRow / 2) * 0.7, 0, row * 0.8)
      seatingGroup.add(chair)
    }
  }

  // Si es VIP, agregar alfombra roja
  if (isVIP) {
    const carpetGeometry = new THREE.BoxGeometry(seatsPerRow * 0.7 + 0.5, 0.02, rows * 0.8 + 0.5)
    const carpetMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.9 })
    const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial)
    carpet.position.y = 0.01
    carpet.position.z = (rows - 1) * 0.4
    seatingGroup.add(carpet)

    // Postes con cuerda
    const postGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8)
    const postMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 })

    const corners = [
      { x: -seatsPerRow * 0.35 - 0.3, z: -0.3 },
      { x: seatsPerRow * 0.35 + 0.3, z: -0.3 },
      { x: -seatsPerRow * 0.35 - 0.3, z: rows * 0.8 + 0.3 },
      { x: seatsPerRow * 0.35 + 0.3, z: rows * 0.8 + 0.3 },
    ]

    corners.forEach((corner) => {
      const post = new THREE.Mesh(postGeometry, postMaterial)
      post.position.set(corner.x, 0.5, corner.z)
      seatingGroup.add(post)
    })
  }

  return seatingGroup
}

function createMedicalStation(color: string): THREE.Group {
  const medicalGroup = new THREE.Group()

  // Mesa de examen
  const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1)
  const tableMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
  const table = new THREE.Mesh(tableGeometry, tableMaterial)
  table.position.y = 0.8
  medicalGroup.add(table)

  // Patas de la mesa
  const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8)
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.5 })

  const legPositions = [
    { x: -0.9, z: -0.4 },
    { x: -0.9, z: 0.4 },
    { x: 0.9, z: -0.4 },
    { x: 0.9, z: 0.4 },
  ]

  legPositions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial)
    leg.position.set(pos.x, 0.4, pos.z)
    medicalGroup.add(leg)
  })

  // Cruz roja
  const crossMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })

  const crossVertical = new THREE.BoxGeometry(0.2, 0.6, 0.05)
  const crossV = new THREE.Mesh(crossVertical, crossMaterial)
  crossV.position.set(0, 1.5, -0.5)
  medicalGroup.add(crossV)

  const crossHorizontal = new THREE.BoxGeometry(0.6, 0.2, 0.05)
  const crossH = new THREE.Mesh(crossHorizontal, crossMaterial)
  crossH.position.set(0, 1.5, -0.5)
  medicalGroup.add(crossH)

  // Botiquín
  const kitGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.2)
  const kitMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const kit = new THREE.Mesh(kitGeometry, kitMaterial)
  kit.position.set(0.6, 0.95, 0)
  medicalGroup.add(kit)

  // Silla
  const chair = createChair(color)
  chair.position.set(-1, 0, 0.8)
  medicalGroup.add(chair)

  return medicalGroup
}

function createSecurityPost(color: string): THREE.Group {
  const securityGroup = new THREE.Group()

  // Escritorio
  const deskGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.8)
  const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6 })
  const desk = new THREE.Mesh(deskGeometry, deskMaterial)
  desk.position.y = 0.75
  securityGroup.add(desk)

  // Base del escritorio
  const baseGeometry = new THREE.BoxGeometry(1.5, 0.75, 0.8)
  const base = new THREE.Mesh(baseGeometry, deskMaterial)
  base.position.y = 0.375
  securityGroup.add(base)

  // Monitor
  const monitorGeometry = new THREE.BoxGeometry(0.5, 0.4, 0.05)
  const monitorMaterial = new THREE.MeshStandardMaterial({
    color: 0x001a33,
    emissive: 0x0066cc,
    emissiveIntensity: 0.2,
  })
  const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial)
  monitor.position.set(0, 1.1, 0.38)
  securityGroup.add(monitor)

  // Base del monitor
  const monitorBaseGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.2)
  const monitorBase = new THREE.Mesh(monitorBaseGeometry, deskMaterial)
  monitorBase.position.set(0, 0.9, 0.38)
  securityGroup.add(monitorBase)

  // Silla giratoria
  const chair = createOfficeChair(color)
  chair.position.set(0, 0, -0.8)
  securityGroup.add(chair)

  // Barrera de seguridad
  const barrierGeometry = new THREE.BoxGeometry(2, 0.05, 0.1)
  const barrierMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 })
  const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial)
  barrier.position.set(0, 0.025, 1.5)
  securityGroup.add(barrier)

  return securityGroup
}

function createOfficeChair(color: string): THREE.Group {
  const chairGroup = new THREE.Group()

  // Asiento
  const seatGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.6)
  const seatMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  const seat = new THREE.Mesh(seatGeometry, seatMaterial)
  seat.position.y = 0.5
  chairGroup.add(seat)

  // Respaldo
  const backGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.1)
  const back = new THREE.Mesh(backGeometry, seatMaterial)
  back.position.set(0, 0.9, -0.25)
  chairGroup.add(back)

  // Base giratoria
  const baseGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.1, 16)
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7 })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = 0.05
  chairGroup.add(base)

  // Pata central
  const centerGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.4, 8)
  const center = new THREE.Mesh(centerGeometry, baseMaterial)
  center.position.y = 0.2
  chairGroup.add(center)

  // Ruedas
  const wheelGeometry = new THREE.SphereGeometry(0.08, 16, 16)
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a })

  const wheelPositions = [
    { x: 0.25, z: 0.25 },
    { x: -0.25, z: 0.25 },
    { x: 0.25, z: -0.25 },
    { x: -0.25, z: -0.25 },
  ]

  wheelPositions.forEach((pos) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel.position.set(pos.x, 0.08, pos.z)
    chairGroup.add(wheel)
  })

  return chairGroup
}

// ============================================================================
// FUNCIONES PARA CREAR OBJETOS 3D ADICIONALES
// ============================================================================

function createRamp(color: string): THREE.Group {
  const rampGroup = new THREE.Group()

  // Superficie de la rampa
  const rampGeometry = new THREE.BoxGeometry(2, 0.1, 4)
  const rampMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
  const ramp = new THREE.Mesh(rampGeometry, rampMaterial)
  ramp.position.y = 0.8
  ramp.rotation.x = -Math.PI / 8
  rampGroup.add(ramp)

  // Barandas laterales
  const railMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 })
  const railGeometry = new THREE.BoxGeometry(0.1, 0.8, 4)

  const leftRail = new THREE.Mesh(railGeometry, railMaterial)
  leftRail.position.set(-1, 1.2, 0)
  leftRail.rotation.x = -Math.PI / 8
  rampGroup.add(leftRail)

  const rightRail = new THREE.Mesh(railGeometry, railMaterial)
  rightRail.position.set(1, 1.2, 0)
  rightRail.rotation.x = -Math.PI / 8
  rampGroup.add(rightRail)

  // Textura antideslizante
  const gripGeometry = new THREE.BoxGeometry(1.8, 0.12, 0.1)
  const gripMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.9 })

  for (let i = 0; i < 8; i++) {
    const grip = new THREE.Mesh(gripGeometry, gripMaterial)
    grip.position.set(0, 0.81 + i * 0.2, -1.5 + i * 0.5)
    grip.rotation.x = -Math.PI / 8
    rampGroup.add(grip)
  }

  return rampGroup
}

function createMarketingBooth(color: string): THREE.Group {
  const boothGroup = new THREE.Group()

  // Base del stand
  const baseGeometry = new THREE.BoxGeometry(3, 0.2, 3)
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6 })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = 0.1
  boothGroup.add(base)

  // Paredes del stand
  const wallMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.5 })

  // Pared trasera
  const backWallGeometry = new THREE.BoxGeometry(3, 2.5, 0.1)
  const backWall = new THREE.Mesh(backWallGeometry, wallMaterial)
  backWall.position.set(0, 1.35, -1.45)
  boothGroup.add(backWall)

  // Paredes laterales
  const sideWallGeometry = new THREE.BoxGeometry(0.1, 2.5, 3)
  const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial)
  leftWall.position.set(-1.45, 1.35, 0)
  boothGroup.add(leftWall)

  const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial)
  rightWall.position.set(1.45, 1.35, 0)
  boothGroup.add(rightWall)

  // Techo/Banner superior
  const roofGeometry = new THREE.BoxGeometry(3, 0.1, 1)
  const roofMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
  const roof = new THREE.Mesh(roofGeometry, roofMaterial)
  roof.position.set(0, 2.6, -1)
  boothGroup.add(roof)

  // Logo/Pantalla en la pared trasera
  const screenGeometry = new THREE.BoxGeometry(2, 1.2, 0.05)
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x001a33,
    emissive: 0x0066cc,
    emissiveIntensity: 0.3,
  })
  const screen = new THREE.Mesh(screenGeometry, screenMaterial)
  screen.position.set(0, 1.8, -1.4)
  boothGroup.add(screen)

  // Mesa de demostración
  const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1)
  const tableMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
  const table = new THREE.Mesh(tableGeometry, tableMaterial)
  table.position.set(0, 0.8, 0.5)
  boothGroup.add(table)

  // Patas de la mesa
  const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8)
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc })

  const legPositions = [
    { x: -0.9, z: 0.1 },
    { x: -0.9, z: 0.9 },
    { x: 0.9, z: 0.1 },
    { x: 0.9, z: 0.9 },
  ]

  legPositions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial)
    leg.position.set(pos.x, 0.4, pos.z)
    boothGroup.add(leg)
  })

  // Folletos en la mesa
  const brochureGeometry = new THREE.BoxGeometry(0.3, 0.02, 0.4)
  const brochureMaterial = new THREE.MeshStandardMaterial({ color: 0xff6600 })

  for (let i = 0; i < 3; i++) {
    const brochure = new THREE.Mesh(brochureGeometry, brochureMaterial)
    brochure.position.set(-0.6 + i * 0.6, 0.86, 0.5)
    boothGroup.add(brochure)
  }

  // Sillas para visitantes
  const chair1 = createChair(color)
  chair1.position.set(-0.8, 0, 1.2)
  boothGroup.add(chair1)

  const chair2 = createChair(color)
  chair2.position.set(0.8, 0, 1.2)
  boothGroup.add(chair2)

  return boothGroup
}

function createEscalator(color: string): THREE.Group {
  const escalatorGroup = new THREE.Group()

  // Base de la escalera mecánica
  const baseGeometry = new THREE.BoxGeometry(1.5, 0.2, 5)
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.4 })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = 0.1
  base.rotation.x = -Math.PI / 12
  escalatorGroup.add(base)

  // Escalones
  const stepMaterial = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.5, roughness: 0.5 })
  const steps = 12

  for (let i = 0; i < steps; i++) {
    const stepGeometry = new THREE.BoxGeometry(1.3, 0.15, 0.4)
    const step = new THREE.Mesh(stepGeometry, stepMaterial)
    step.position.set(0, 0.2 + i * 0.15, -2 + i * 0.4)
    escalatorGroup.add(step)
  }

  // Barandas móviles
  const handrailMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.3, roughness: 0.7 })
  const handrailGeometry = new THREE.CylinderGeometry(0.08, 0.08, 5, 16)

  const leftHandrail = new THREE.Mesh(handrailGeometry, handrailMaterial)
  leftHandrail.position.set(-0.75, 1.2, 0)
  leftHandrail.rotation.x = -Math.PI / 12
  leftHandrail.rotation.z = Math.PI / 2
  escalatorGroup.add(leftHandrail)

  const rightHandrail = new THREE.Mesh(handrailGeometry, handrailMaterial)
  rightHandrail.position.set(0.75, 1.2, 0)
  rightHandrail.rotation.x = -Math.PI / 12
  rightHandrail.rotation.z = Math.PI / 2
  escalatorGroup.add(rightHandrail)

  // Paneles laterales
  const panelGeometry = new THREE.BoxGeometry(0.1, 1, 5)
  const panelMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.4, roughness: 0.6 })

  const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial)
  leftPanel.position.set(-0.8, 0.5, 0)
  leftPanel.rotation.x = -Math.PI / 12
  escalatorGroup.add(leftPanel)

  const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial)
  rightPanel.position.set(0.8, 0.5, 0)
  rightPanel.rotation.x = -Math.PI / 12
  escalatorGroup.add(rightPanel)

  return escalatorGroup
}

function createCloakroom(color: string): THREE.Group {
  const cloakroomGroup = new THREE.Group()

  // Mostrador
  const counterGeometry = new THREE.BoxGeometry(2.5, 0.1, 1)
  const counterMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.4 })
  const counter = new THREE.Mesh(counterGeometry, counterMaterial)
  counter.position.y = 1
  cloakroomGroup.add(counter)

  // Base del mostrador
  const baseGeometry = new THREE.BoxGeometry(2.5, 1, 1)
  const baseMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = 0.5
  cloakroomGroup.add(base)

  // Perchero trasero
  const rackGeometry = new THREE.BoxGeometry(2.5, 2, 0.2)
  const rackMaterial = new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.7 })
  const rack = new THREE.Mesh(rackGeometry, rackMaterial)
  rack.position.set(0, 1.5, -0.6)
  cloakroomGroup.add(rack)

  // Ganchos con abrigos
  const coatColors = [0x1a1a1a, 0x8b4513, 0x000080, 0x8b0000, 0x2f4f4f]

  for (let i = 0; i < 5; i++) {
    // Gancho
    const hookGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 8)
    const hookMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8 })
    const hook = new THREE.Mesh(hookGeometry, hookMaterial)
    hook.position.set(-1 + i * 0.5, 1.8, -0.55)
    hook.rotation.z = Math.PI / 2
    cloakroomGroup.add(hook)

    // Abrigo
    const coatGeometry = new THREE.BoxGeometry(0.3, 0.6, 0.15)
    const coatMaterial = new THREE.MeshStandardMaterial({ color: coatColors[i], roughness: 0.8 })
    const coat = new THREE.Mesh(coatGeometry, coatMaterial)
    coat.position.set(-1 + i * 0.5, 1.4, -0.5)
    cloakroomGroup.add(coat)
  }

  // Tickets en el mostrador
  const ticketGeometry = new THREE.BoxGeometry(0.4, 0.02, 0.3)
  const ticketMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })

  for (let i = 0; i < 3; i++) {
    const ticket = new THREE.Mesh(ticketGeometry, ticketMaterial)
    ticket.position.set(-0.6 + i * 0.6, 1.06, 0.3)
    cloakroomGroup.add(ticket)
  }

  return cloakroomGroup
}

function createMerchandise(color: string): THREE.Group {
  const merchGroup = new THREE.Group()

  // Estantería principal
  const shelfGeometry = new THREE.BoxGeometry(3, 2, 0.4)
  const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.6 })
  const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial)
  shelf.position.set(0, 1, -0.5)
  merchGroup.add(shelf)

  // Productos en estantes (camisetas, gorras, etc.)
  const productColors = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00, 0xff00ff, 0x00ffff]

  // Fila superior - Gorras
  for (let i = 0; i < 6; i++) {
    const capGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.1, 16)
    const capMaterial = new THREE.MeshStandardMaterial({ color: productColors[i] })
    const cap = new THREE.Mesh(capGeometry, capMaterial)
    cap.position.set(-1.2 + i * 0.4, 1.8, -0.3)
    merchGroup.add(cap)
  }

  // Fila media - Camisetas dobladas
  for (let i = 0; i < 6; i++) {
    const shirtGeometry = new THREE.BoxGeometry(0.25, 0.15, 0.2)
    const shirtMaterial = new THREE.MeshStandardMaterial({ color: productColors[i] })
    const shirt = new THREE.Mesh(shirtGeometry, shirtMaterial)
    shirt.position.set(-1.2 + i * 0.4, 1.2, -0.3)
    merchGroup.add(shirt)
  }

  // Fila inferior - Tazas
  for (let i = 0; i < 6; i++) {
    const mugGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.12, 16)
    const mugMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const mug = new THREE.Mesh(mugGeometry, mugMaterial)
    mug.position.set(-1.2 + i * 0.4, 0.6, -0.3)
    merchGroup.add(mug)
  }

  // Mesa de exhibición frontal
  const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1)
  const tableMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
  const table = new THREE.Mesh(tableGeometry, tableMaterial)
  table.position.set(0, 0.8, 0.5)
  merchGroup.add(table)

  // Productos destacados en la mesa
  const featuredGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.3)
  const featuredMaterial = new THREE.MeshStandardMaterial({ color })

  for (let i = 0; i < 3; i++) {
    const featured = new THREE.Mesh(featuredGeometry, featuredMaterial)
    featured.position.set(-0.6 + i * 0.6, 0.95, 0.5)
    merchGroup.add(featured)
  }

  // Letrero de precios
  const signGeometry = new THREE.BoxGeometry(1, 0.5, 0.05)
  const signMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 })
  const sign = new THREE.Mesh(signGeometry, signMaterial)
  sign.position.set(0, 2.3, -0.45)
  merchGroup.add(sign)

  return merchGroup
}

function createPhotoBooth(color: string): THREE.Group {
  const photoBoothGroup = new THREE.Group()

  // Cabina principal
  const boothGeometry = new THREE.BoxGeometry(1.5, 2.5, 1.5)
  const boothMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
  const booth = new THREE.Mesh(boothGeometry, boothMaterial)
  booth.position.y = 1.25
  photoBoothGroup.add(booth)

  // Cortina frontal
  const curtainGeometry = new THREE.BoxGeometry(1.3, 2, 0.05)
  const curtainMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.9 })
  const curtain = new THREE.Mesh(curtainGeometry, curtainMaterial)
  curtain.position.set(0, 1.2, 0.76)
  photoBoothGroup.add(curtain)

  // Cámara
  const cameraGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.15)
  const cameraMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.7 })
  const camera = new THREE.Mesh(cameraGeometry, cameraMaterial)
  camera.position.set(0, 2, 0)
  photoBoothGroup.add(camera)

  // Lente de la cámara
  const lensGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16)
  const lensMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.9 })
  const lens = new THREE.Mesh(lensGeometry, lensMaterial)
  lens.rotation.x = Math.PI / 2
  lens.position.set(0, 2, 0.1)
  photoBoothGroup.add(lens)

  // Flash
  const flashGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.1)
  const flashMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.5,
  })
  const flash = new THREE.Mesh(flashGeometry, flashMaterial)
  flash.position.set(0, 2.3, 0)
  photoBoothGroup.add(flash)

  // Pantalla de vista previa
  const screenGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.05)
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x001a33,
    emissive: 0x0066cc,
    emissiveIntensity: 0.3,
  })
  const screen = new THREE.Mesh(screenGeometry, screenMaterial)
  screen.position.set(0, 0.8, 0.76)
  photoBoothGroup.add(screen)

  // Banquito para sentarse
  const stoolGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16)
  const stoolMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 })
  const stool = new THREE.Mesh(stoolGeometry, stoolMaterial)
  stool.position.set(0, 0.25, 0)
  photoBoothGroup.add(stool)

  // Letrero "PHOTO BOOTH"
  const signGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.05)
  const signMaterial = new THREE.MeshStandardMaterial({
    color: 0xff00ff,
    emissive: 0xff00ff,
    emissiveIntensity: 0.4,
  })
  const sign = new THREE.Mesh(signGeometry, signMaterial)
  sign.position.set(0, 2.7, 0.76)
  photoBoothGroup.add(sign)

  return photoBoothGroup
}

function createKitchen(color: string): THREE.Group {
  const kitchenGroup = new THREE.Group()

  // Mostrador de cocina
  const counterGeometry = new THREE.BoxGeometry(3, 0.1, 1.5)
  const counterMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.2, metalness: 0.5 })
  const counter = new THREE.Mesh(counterGeometry, counterMaterial)
  counter.position.y = 0.9
  kitchenGroup.add(counter)

  // Base del mostrador
  const baseGeometry = new THREE.BoxGeometry(3, 0.9, 1.5)
  const baseMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = 0.45
  kitchenGroup.add(base)

  // Estufa
  const stoveGeometry = new THREE.BoxGeometry(0.8, 0.15, 0.8)
  const stoveMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8 })
  const stove = new THREE.Mesh(stoveGeometry, stoveMaterial)
  stove.position.set(-0.8, 1, 0)
  kitchenGroup.add(stove)

  // Hornillas
  const burnerGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 16)
  const burnerMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4500,
    emissive: 0xff4500,
    emissiveIntensity: 0.3,
  })

  const burnerPositions = [
    { x: -1, z: -0.2 },
    { x: -1, z: 0.2 },
    { x: -0.6, z: -0.2 },
    { x: -0.6, z: 0.2 },
  ]

  burnerPositions.forEach((pos) => {
    const burner = new THREE.Mesh(burnerGeometry, burnerMaterial)
    burner.position.set(pos.x, 1.08, pos.z)
    kitchenGroup.add(burner)
  })

  // Fregadero
  const sinkGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.5)
  const sinkMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.1 })
  const sink = new THREE.Mesh(sinkGeometry, sinkMaterial)
  sink.position.set(0.8, 0.85, 0)
  kitchenGroup.add(sink)

  // Grifo
  const faucetGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8)
  const faucetMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.1 })
  const faucet = new THREE.Mesh(faucetGeometry, faucetMaterial)
  faucet.position.set(0.8, 1.15, 0)
  kitchenGroup.add(faucet)

  // Ollas y sartenes
  const potGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.2, 16)
  const potMaterial = new THREE.MeshStandardMaterial({ color: 0x708090, metalness: 0.7 })

  const pot1 = new THREE.Mesh(potGeometry, potMaterial)
  pot1.position.set(-1, 1.2, -0.2)
  kitchenGroup.add(pot1)

  const pot2 = new THREE.Mesh(potGeometry, potMaterial)
  pot2.position.set(-0.6, 1.2, 0.2)
  kitchenGroup.add(pot2)

  // Campana extractora
  const hoodGeometry = new THREE.BoxGeometry(1.2, 0.6, 1)
  const hoodMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.6 })
  const hood = new THREE.Mesh(hoodGeometry, hoodMaterial)
  hood.position.set(-0.8, 2, 0)
  kitchenGroup.add(hood)

  // Estantes con utensilios
  const shelfGeometry = new THREE.BoxGeometry(3, 0.05, 0.4)
  const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 })
  const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial)
  shelf.position.set(0, 1.8, -0.7)
  kitchenGroup.add(shelf)

  return kitchenGroup
}

function createBackstage(color: string): THREE.Group {
  const backstageGroup = new THREE.Group()

  // Área principal
  const floorGeometry = new THREE.BoxGeometry(4, 0.1, 4)
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x2f2f2f, roughness: 0.8 })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.position.y = 0.05
  backstageGroup.add(floor)

  // Cortinas negras
  const curtainGeometry = new THREE.BoxGeometry(0.1, 3, 4)
  const curtainMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.9 })

  const leftCurtain = new THREE.Mesh(curtainGeometry, curtainMaterial)
  leftCurtain.position.set(-2, 1.5, 0)
  backstageGroup.add(leftCurtain)

  const rightCurtain = new THREE.Mesh(curtainGeometry, curtainMaterial)
  rightCurtain.position.set(2, 1.5, 0)
  backstageGroup.add(rightCurtain)

  const backCurtain = new THREE.BoxGeometry(4, 3, 0.1)
  const backCurtainMesh = new THREE.Mesh(backCurtain, curtainMaterial)
  backCurtainMesh.position.set(0, 1.5, -2)
  backstageGroup.add(backCurtainMesh)

  // Espejos con luces
  const mirrorGeometry = new THREE.BoxGeometry(1.5, 2, 0.1)
  const mirrorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.9,
    roughness: 0.1,
  })

  const mirror1 = new THREE.Mesh(mirrorGeometry, mirrorMaterial)
  mirror1.position.set(-1.5, 1.5, -1.9)
  backstageGroup.add(mirror1)

  const mirror2 = new THREE.Mesh(mirrorGeometry, mirrorMaterial)
  mirror2.position.set(1.5, 1.5, -1.9)
  backstageGroup.add(mirror2)

  // Luces alrededor de los espejos
  const lightGeometry = new THREE.SphereGeometry(0.08, 16, 16)
  const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 0.6,
  })

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const light1 = new THREE.Mesh(lightGeometry, lightMaterial)
    light1.position.set(-1.5 + Math.cos(angle) * 0.8, 1.5 + Math.sin(angle) * 1.1, -1.85)
    backstageGroup.add(light1)

    const light2 = new THREE.Mesh(lightGeometry, lightMaterial)
    light2.position.set(1.5 + Math.cos(angle) * 0.8, 1.5 + Math.sin(angle) * 1.1, -1.85)
    backstageGroup.add(light2)
  }

  // Mesas de maquillaje
  const tableGeometry = new THREE.BoxGeometry(1.2, 0.1, 0.6)
  const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 })

  const table1 = new THREE.Mesh(tableGeometry, tableMaterial)
  table1.position.set(-1.5, 0.8, -1.2)
  backstageGroup.add(table1)

  const table2 = new THREE.Mesh(tableGeometry, tableMaterial)
  table2.position.set(1.5, 0.8, -1.2)
  backstageGroup.add(table2)

  // Sillas
  const chair1 = createChair(color)
  chair1.position.set(-1.5, 0, -0.5)
  backstageGroup.add(chair1)

  const chair2 = createChair(color)
  chair2.position.set(1.5, 0, -0.5)
  backstageGroup.add(chair2)

  // Perchero con vestuario
  const rackGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8)
  const rackMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.7 })
  const rack = new THREE.Mesh(rackGeometry, rackMaterial)
  rack.position.set(0, 1, 1.5)
  rack.rotation.z = Math.PI / 2
  backstageGroup.add(rack)

  // Ropa colgada
  const clothColors = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00, 0xff00ff]
  for (let i = 0; i < 5; i++) {
    const clothGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.1)
    const clothMaterial = new THREE.MeshStandardMaterial({ color: clothColors[i] })
    const cloth = new THREE.Mesh(clothGeometry, clothMaterial)
    cloth.position.set(-0.8 + i * 0.4, 1, 1.5)
    backstageGroup.add(cloth)
  }

  return backstageGroup
}

function createRegistration(color: string): THREE.Group {
  const registrationGroup = new THREE.Group()

  // Mostrador largo
  const counterGeometry = new THREE.BoxGeometry(4, 0.1, 1.2)
  const counterMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
  const counter = new THREE.Mesh(counterGeometry, counterMaterial)
  counter.position.y = 1
  registrationGroup.add(counter)

  // Base del mostrador
  const baseGeometry = new THREE.BoxGeometry(4, 1, 1.2)
  const baseMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = 0.5
  registrationGroup.add(base)

  // Computadoras
  const monitorGeometry = new THREE.BoxGeometry(0.5, 0.4, 0.05)
  const monitorMaterial = new THREE.MeshStandardMaterial({
    color: 0x001a33,
    emissive: 0x0066cc,
    emissiveIntensity: 0.2,
  })

  for (let i = 0; i < 3; i++) {
    const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial)
    monitor.position.set(-1.2 + i * 1.2, 1.3, 0.55)
    registrationGroup.add(monitor)

    // Base del monitor
    const standGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.2)
    const standMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
    const stand = new THREE.Mesh(standGeometry, standMaterial)
    stand.position.set(-1.2 + i * 1.2, 1.08, 0.55)
    registrationGroup.add(stand)
  }

  // Teclados
  const keyboardGeometry = new THREE.BoxGeometry(0.4, 0.02, 0.15)
  const keyboardMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a })

  for (let i = 0; i < 3; i++) {
    const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial)
    keyboard.position.set(-1.2 + i * 1.2, 1.06, 0.3)
    registrationGroup.add(keyboard)
  }

  // Impresoras de credenciales
  const printerGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.25)
  const printerMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 })

  for (let i = 0; i < 3; i++) {
    const printer = new THREE.Mesh(printerGeometry, printerMaterial)
    printer.position.set(-1.2 + i * 1.2, 1.15, -0.4)
    registrationGroup.add(printer)
  }

  // Letrero "REGISTRATION"
  const signGeometry = new THREE.BoxGeometry(3, 0.5, 0.05)
  const signMaterial = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.3,
  })
  const sign = new THREE.Mesh(signGeometry, signMaterial)
  sign.position.set(0, 2, 0.6)
  registrationGroup.add(sign)

  // Sillas para el personal
  for (let i = 0; i < 3; i++) {
    const chair = createOfficeChair(color)
    chair.position.set(-1.2 + i * 1.2, 0, -0.8)
    registrationGroup.add(chair)
  }

  // Fila de espera
  const barrierGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8)
  const barrierMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.7 })

  for (let i = 0; i < 5; i++) {
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial)
    barrier.position.set(-2 + i, 0.5, 1.5)
    registrationGroup.add(barrier)

    // Cuerda entre barreras
    if (i < 4) {
      const ropeGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8)
      const ropeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
      const rope = new THREE.Mesh(ropeGeometry, ropeMaterial)
      rope.rotation.z = Math.PI / 2
      rope.position.set(-1.5 + i, 0.8, 1.5)
      registrationGroup.add(rope)
    }
  }

  return registrationGroup
}

function createPressArea(color: string): THREE.Group {
  const pressGroup = new THREE.Group()

  // Plataforma elevada
  const platformGeometry = new THREE.BoxGeometry(4, 0.3, 3)
  const platformMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  const platform = new THREE.Mesh(platformGeometry, platformMaterial)
  platform.position.y = 0.15
  pressGroup.add(platform)

  // Mesas para prensa
  const tableGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.8)
  const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.5 })

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const table = new THREE.Mesh(tableGeometry, tableMaterial)
      table.position.set(-0.8 + col * 1.6, 0.8, -0.6 + row * 1.2)
      pressGroup.add(table)

      // Patas de la mesa
      const legGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8)
      const legMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 })

      const legPositions = [
        { x: -0.6, z: -0.3 },
        { x: -0.6, z: 0.3 },
        { x: 0.6, z: -0.3 },
        { x: 0.6, z: 0.3 },
      ]

      legPositions.forEach((pos) => {
        const leg = new THREE.Mesh(legGeometry, legMaterial)
        leg.position.set(-0.8 + col * 1.6 + pos.x, 0.55, -0.6 + row * 1.2 + pos.z)
        pressGroup.add(leg)
      })

      // Laptop en cada mesa
      const laptopGeometry = new THREE.BoxGeometry(0.35, 0.02, 0.25)
      const laptopMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
      const laptop = new THREE.Mesh(laptopGeometry, laptopMaterial)
      laptop.position.set(-0.8 + col * 1.6, 0.86, -0.6 + row * 1.2)
      pressGroup.add(laptop)

      // Pantalla del laptop
      const screenGeometry = new THREE.BoxGeometry(0.35, 0.25, 0.02)
      const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x001a33,
        emissive: 0x0066cc,
        emissiveIntensity: 0.2,
      })
      const screen = new THREE.Mesh(screenGeometry, screenMaterial)
      screen.position.set(-0.8 + col * 1.6, 0.98, -0.6 + row * 1.2 - 0.1)
      screen.rotation.x = -Math.PI / 6
      pressGroup.add(screen)

      // Silla
      const chair = createOfficeChair(color)
      chair.position.set(-0.8 + col * 1.6, 0.3, -0.6 + row * 1.2 + 0.6)
      pressGroup.add(chair)
    }
  }

  // Cámaras en trípodes
  for (let i = 0; i < 3; i++) {
    // Trípode
    const tripodGeometry = new THREE.CylinderGeometry(0.02, 0.05, 1.5, 8)
    const tripodMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
    const tripod = new THREE.Mesh(tripodGeometry, tripodMaterial)
    tripod.position.set(-1.5 + i * 1.5, 1.05, 1.2)
    pressGroup.add(tripod)

    // Cámara
    const cameraGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.2)
    const cameraMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.6 })
    const camera = new THREE.Mesh(cameraGeometry, cameraMaterial)
    camera.position.set(-1.5 + i * 1.5, 1.8, 1.2)
    pressGroup.add(camera)

    // Lente
    const lensGeometry = new THREE.CylinderGeometry(0.05, 0.06, 0.15, 16)
    const lensMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.9 })
    const lens = new THREE.Mesh(lensGeometry, lensMaterial)
    lens.rotation.x = Math.PI / 2
    lens.position.set(-1.5 + i * 1.5, 1.8, 1.3)
    pressGroup.add(lens)
  }

  // Letrero "PRESS"
  const signGeometry = new THREE.BoxGeometry(2, 0.4, 0.05)
  const signMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 0.3,
  })
  const sign = new THREE.Mesh(signGeometry, signMaterial)
  sign.position.set(0, 2.5, -1.5)
  pressGroup.add(sign)

  return pressGroup
}

function createStandingArea(color: string): THREE.Group {
  const standingGroup = new THREE.Group()

  // Área delimitada con barreras
  const barrierGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8)
  const barrierMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.7 })

  // Perímetro de barreras
  const perimeter = [
    { x: -2, z: -2 },
    { x: -1, z: -2 },
    { x: 0, z: -2 },
    { x: 1, z: -2 },
    { x: 2, z: -2 },
    { x: 2, z: -1 },
    { x: 2, z: 0 },
    { x: 2, z: 1 },
    { x: 2, z: 2 },
    { x: 1, z: 2 },
    { x: 0, z: 2 },
    { x: -1, z: 2 },
    { x: -2, z: 2 },
    { x: -2, z: 1 },
    { x: -2, z: 0 },
    { x: -2, z: -1 },
  ]

  perimeter.forEach((pos, index) => {
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial)
    barrier.position.set(pos.x, 0.5, pos.z)
    standingGroup.add(barrier)

    // Cuerda entre barreras
    if (index < perimeter.length - 1) {
      const nextPos = perimeter[index + 1]
      const distance = Math.sqrt(Math.pow(nextPos.x - pos.x, 2) + Math.pow(nextPos.z - pos.z, 2))
      const ropeGeometry = new THREE.CylinderGeometry(0.02, 0.02, distance, 8)
      const ropeMaterial = new THREE.MeshStandardMaterial({ color })
      const rope = new THREE.Mesh(ropeGeometry, ropeMaterial)

      const angle = Math.atan2(nextPos.z - pos.z, nextPos.x - pos.x)
      rope.rotation.z = Math.PI / 2 - angle
      rope.position.set((pos.x + nextPos.x) / 2, 0.8, (pos.z + nextPos.z) / 2)
      standingGroup.add(rope)
    }
  })

  // Suelo del área
  const floorGeometry = new THREE.BoxGeometry(4, 0.05, 4)
  const floorMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.9 })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.position.y = 0.025
  standingGroup.add(floor)

  // Letrero "STANDING AREA"
  const signGeometry = new THREE.BoxGeometry(2, 0.3, 0.05)
  const signMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 0.3,
  })
  const sign = new THREE.Mesh(signGeometry, signMaterial)
  sign.position.set(0, 1.5, -2.1)
  standingGroup.add(sign)

  return standingGroup
}

function createVIPArea(color: string): THREE.Group {
  const vipGroup = new THREE.Group()

  // Alfombra roja
  const carpetGeometry = new THREE.BoxGeometry(5, 0.02, 4)
  const carpetMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.9 })
  const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial)
  carpet.position.y = 0.01
  vipGroup.add(carpet)

  // Postes dorados con cuerdas
  const postGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16)
  const postMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 })

  const postPositions = [
    { x: -2.5, z: -2 },
    { x: -2.5, z: 0 },
    { x: -2.5, z: 2 },
    { x: 2.5, z: -2 },
    { x: 2.5, z: 0 },
    { x: 2.5, z: 2 },
    { x: -1, z: -2 },
    { x: 1, z: -2 },
    { x: -1, z: 2 },
    { x: 1, z: 2 },
  ]

  postPositions.forEach((pos) => {
    const post = new THREE.Mesh(postGeometry, postMaterial)
    post.position.set(pos.x, 0.6, pos.z)
    vipGroup.add(post)
  })

  // Cuerdas doradas
  const ropeGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1, 8)
  const ropeMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.7 })

  // Cuerdas laterales
  for (let i = 0; i < 2; i++) {
    const rope1 = new THREE.Mesh(ropeGeometry, ropeMaterial)
    rope1.rotation.z = Math.PI / 2
    rope1.position.set(-2.5, 1, -1 + i * 2)
    vipGroup.add(rope1)

    const rope2 = new THREE.Mesh(ropeGeometry, ropeMaterial)
    rope2.rotation.z = Math.PI / 2
    rope2.position.set(2.5, 1, -1 + i * 2)
    vipGroup.add(rope2)
  }

  // Sofás VIP
  const sofaGeometry = new THREE.BoxGeometry(1.5, 0.6, 0.8)
  const sofaMaterial = new THREE.MeshStandardMaterial({ color: 0x4b0082, roughness: 0.7 })

  for (let i = 0; i < 3; i++) {
    const sofa = new THREE.Mesh(sofaGeometry, sofaMaterial)
    sofa.position.set(-1.5 + i * 1.5, 0.3, 0)
    vipGroup.add(sofa)

    // Respaldo del sofá
    const backGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.2)
    const back = new THREE.Mesh(backGeometry, sofaMaterial)
    back.position.set(-1.5 + i * 1.5, 0.7, -0.3)
    vipGroup.add(back)
  }

  // Mesas de centro
  const tableGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16)
  const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.2 })

  for (let i = 0; i < 3; i++) {
    const table = new THREE.Mesh(tableGeometry, tableMaterial)
    table.position.set(-1.5 + i * 1.5, 0.25, 0.8)
    vipGroup.add(table)

    // Copas en las mesas
    const glassGeometry = new THREE.CylinderGeometry(0.05, 0.04, 0.15, 16)
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
    })

    for (let j = 0; j < 2; j++) {
      const glass = new THREE.Mesh(glassGeometry, glassMaterial)
      glass.position.set(-1.5 + i * 1.5 + (j - 0.5) * 0.2, 0.58, 0.8)
      vipGroup.add(glass)
    }
  }

  // Letrero "VIP"
  const signGeometry = new THREE.BoxGeometry(1.5, 0.5, 0.05)
  const signMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    emissive: 0xffd700,
    emissiveIntensity: 0.5,
  })
  const sign = new THREE.Mesh(signGeometry, signMaterial)
  sign.position.set(0, 2, -2.1)
  vipGroup.add(sign)

  // Iluminación ambiental especial
  const lightGeometry = new THREE.SphereGeometry(0.1, 16, 16)
  const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    emissive: 0xffd700,
    emissiveIntensity: 0.8,
  })

  for (let i = 0; i < 4; i++) {
    const light = new THREE.Mesh(lightGeometry, lightMaterial)
    light.position.set(-1.5 + i, 2.5, 0)
    vipGroup.add(light)
  }

  return vipGroup
}

function createInfoPoint(color: string): THREE.Group {
  const infoGroup = new THREE.Group()

  // Kiosco circular
  const kioskGeometry = new THREE.CylinderGeometry(1, 1, 1.2, 16)
  const kioskMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
  const kiosk = new THREE.Mesh(kioskGeometry, kioskMaterial)
  kiosk.position.y = 0.6
  infoGroup.add(kiosk)

  // Mostrador superior
  const counterGeometry = new THREE.CylinderGeometry(1.1, 1.1, 0.1, 16)
  const counterMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
  const counter = new THREE.Mesh(counterGeometry, counterMaterial)
  counter.position.y = 1.2
  infoGroup.add(counter)

  // Pantallas informativas alrededor
  const screenGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.05)
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x001a33,
    emissive: 0x0066cc,
    emissiveIntensity: 0.3,
  })

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2
    const screen = new THREE.Mesh(screenGeometry, screenMaterial)
    screen.position.set(Math.cos(angle) * 0.9, 0.9, Math.sin(angle) * 0.9)
    screen.rotation.y = -angle
    infoGroup.add(screen)
  }

  // Letrero superior con "i"
  const signGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 16)
  const signMaterial = new THREE.MeshStandardMaterial({
    color: 0x0066cc,
    emissive: 0x0066cc,
    emissiveIntensity: 0.4,
  })
  const sign = new THREE.Mesh(signGeometry, signMaterial)
  sign.position.y = 2
  infoGroup.add(sign)

  // Símbolo "i"
  const iGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.05)
  const iMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const iSymbol = new THREE.Mesh(iGeometry, iMaterial)
  iSymbol.position.set(0, 2, 0.81)
  infoGroup.add(iSymbol)

  const dotGeometry = new THREE.SphereGeometry(0.08, 16, 16)
  const dot = new THREE.Mesh(dotGeometry, iMaterial)
  dot.position.set(0, 2.4, 0.81)
  infoGroup.add(dot)

  // Folletos y mapas en el mostrador
  const brochureGeometry = new THREE.BoxGeometry(0.2, 0.02, 0.3)
  const brochureColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00]

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2
    const brochureMaterial = new THREE.MeshStandardMaterial({ color: brochureColors[i] })
    const brochure = new THREE.Mesh(brochureGeometry, brochureMaterial)
    brochure.position.set(Math.cos(angle) * 0.6, 1.26, Math.sin(angle) * 0.6)
    brochure.rotation.y = -angle
    infoGroup.add(brochure)
  }

  return infoGroup
}

// ============================================================================
// FUNCIÓN PRINCIPAL PARA OBTENER GEOMETRÍAS DE MARCADORES
// ============================================================================

export const getMarkerGeometry = (type: string, color: string): THREE.Group => {
  switch (type) {
    case "entrance":
      return createDoor(color, true)
    case "exit":
    case "emergency_exit":
      return createDoor(color, false)
    case "stage":
      return createStage(color)
    case "backstage":
      return createBackstage(color)
    case "bar":
      return createBar(color)
    case "food":
      return createFoodStall(color)
    case "kitchen":
      return createKitchen(color)
    case "bathroom":
      return createBathroom(color, false)
    case "accessible_bathroom":
      return createBathroom(color, true)
    case "seating":
      return createSeatingArea(color, false)
    case "vip_seating":
      return createSeatingArea(color, true)
    case "vip_area":
      return createVIPArea(color)
    case "standing_area":
      return createStandingArea(color)
    case "press_area":
      return createPressArea(color)
    case "booth":
    case "sponsor_booth":
      return createBoothTable(color)
    case "info_booth":
    case "info":
      return createInfoPoint(color)
    case "merchandise":
      return createMerchandise(color)
    case "photo_booth":
      return createPhotoBooth(color)
    case "cloakroom":
      return createCloakroom(color)
    case "parking":
      const parkingGroup = new THREE.Group()
      const car1 = createCar("#0066cc")
      car1.position.set(-1.5, 0, 0)
      parkingGroup.add(car1)
      const car2 = createCar("#ff0000")
      car2.position.set(1.5, 0, 0)
      parkingGroup.add(car2)
      return parkingGroup
    case "medical":
      return createMedicalStation(color)
    case "security":
      return createSecurityPost(color)
    case "charging_station":
      return createChargingStation(color)
    case "atm":
      return createATM(color)
    case "elevator":
      return createElevator(color)
    case "escalator":
      return createEscalator(color)
    case "stairs":
      return createStairs(color)
    case "ramp":
      return createRamp(color)
    case "registration":
      return createRegistration(color)
    default:
      const defaultGroup = new THREE.Group()
      const defaultGeometry = new THREE.BoxGeometry(1, 1, 1)
      const defaultMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
      const defaultMesh = new THREE.Mesh(defaultGeometry, defaultMaterial)
      defaultMesh.position.y = 0.5
      defaultGroup.add(defaultMesh)
      return defaultGroup
  }
}

function createFoodStall(color: string): THREE.Group {
  const foodGroup = new THREE.Group()

  // Mostrador
  const counterGeometry = new THREE.BoxGeometry(2, 0.1, 1)
  const counterMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
  const counter = new THREE.Mesh(counterGeometry, counterMaterial)
  counter.position.y = 1
  foodGroup.add(counter)

  // Base
  const baseGeometry = new THREE.BoxGeometry(2, 1, 1)
  const baseMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = 0.5
  foodGroup.add(base)

  // Vitrina de comida
  const displayGeometry = new THREE.BoxGeometry(1.8, 0.4, 0.8)
  const displayMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
  })
  const display = new THREE.Mesh(displayGeometry, displayMaterial)
  display.position.set(0, 1.25, 0)
  foodGroup.add(display)

  // Comida en la vitrina
  const foodColors = [0xff6600, 0xffff00, 0xff0000, 0x00ff00]

  for (let i = 0; i < 4; i++) {
    const foodGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16)
    const foodMaterial = new THREE.MeshStandardMaterial({ color: foodColors[i] })
    const food = new THREE.Mesh(foodGeometry, foodMaterial)
    food.position.set(-0.6 + i * 0.4, 1.15, 0)
    foodGroup.add(food)
  }

  // Menú en la pared trasera
  const menuGeometry = new THREE.BoxGeometry(1.5, 1, 0.05)
  const menuMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
  const menu = new THREE.Mesh(menuGeometry, menuMaterial)
  menu.position.set(0, 1.8, -0.5)
  foodGroup.add(menu)

  // Toldo
  const awningGeometry = new THREE.BoxGeometry(2.2, 0.05, 0.8)
  const awningMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
  const awning = new THREE.Mesh(awningGeometry, awningMaterial)
  awning.position.set(0, 2.5, 0.2)
  awning.rotation.x = -0.3
  foodGroup.add(awning)

  return foodGroup
}
