"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, extend, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CanvasTexture,
  Color,
  Fog,
  Group,
  Object3D,
  Scene,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  Vector3,
} from "three";
import ThreeGlobe from "three-globe";

import countries from "@/data/globe.json";

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: ThreeElements["mesh"] & {
      new (): ThreeGlobe;
    };
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const CAMERA_Z = 480;

export type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeMarker = {
  lat: number;
  lng: number;
  label: string;
  imageUrl?: string;
  imageAltitude?: number;
  imageGlowColor?: string;
  imageSize?: number;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

type Point = {
  size: number;
  order: number;
  color: string;
  lat: number;
  lng: number;
};

type WorldProps = {
  globeConfig: GlobeConfig;
  data: Position[];
  isActive?: boolean;
  markers?: GlobeMarker[];
};

const defaultConfig = {
  pointSize: 1,
  atmosphereColor: "#ffffff",
  showAtmosphere: true,
  atmosphereAltitude: 0.1,
  polygonColor: "rgba(255,255,255,0.7)",
  globeColor: "#1d072e",
  emissive: "#000000",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  arcTime: 2000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
};

function Globe({ globeConfig, data, isActive = true, markers = [] }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const groupRef = useRef<Group | null>(null);
  const ringTickRef = useRef(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const { size } = useThree();
  const scale =
    size.width < 480
      ? 1.08
      : size.width < 640
        ? 1.24
        : size.width < 1024
          ? 1.46
          : size.width < 1440
            ? 1.62
            : 1.72;

  const config = useMemo(
    () => ({
      ...defaultConfig,
      ...globeConfig,
    }),
    [globeConfig],
  );

  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe();
      groupRef.current.add(globeRef.current);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };

    globeMaterial.color = new Color(config.globeColor);
    globeMaterial.emissive = new Color(config.emissive);
    globeMaterial.emissiveIntensity = config.emissiveIntensity;
    globeMaterial.shininess = config.shininess;
  }, [
    config.emissive,
    config.emissiveIntensity,
    config.globeColor,
    config.shininess,
    isInitialized,
  ]);

  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data.length || !isActive) return;

    const points: Point[] = [];

    for (const arc of data) {
      points.push({
        size: config.pointSize,
        order: arc.order,
        color: arc.color,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: config.pointSize,
        order: arc.order,
        color: arc.color,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }

    const filteredPoints = points.filter(
      (point, index, allPoints) =>
        allPoints.findIndex(
          (candidate) =>
            candidate.lat === point.lat && candidate.lng === point.lng,
        ) === index,
    );

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(config.showAtmosphere)
      .atmosphereColor(config.atmosphereColor)
      .atmosphereAltitude(config.atmosphereAltitude)
      .hexPolygonColor(() => config.polygonColor);

    globeRef.current
      .arcsData(data)
      .arcStartLat((item: unknown) => (item as Position).startLat)
      .arcStartLng((item: unknown) => (item as Position).startLng)
      .arcEndLat((item: unknown) => (item as Position).endLat)
      .arcEndLng((item: unknown) => (item as Position).endLng)
      .arcColor((item: unknown) => (item as Position).color)
      .arcAltitude((item: unknown) => (item as Position).arcAlt)
      .arcStroke((item: unknown) => {
        const arc = item as Position;
        return [0.32, 0.28, 0.3][arc.order % 3];
      })
      .arcDashLength(config.arcLength)
      .arcDashInitialGap((item: unknown) => (item as Position).order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => config.arcTime);

    globeRef.current
      .pointsData(filteredPoints)
      .pointColor((item: unknown) => (item as Point).color)
      .pointsMerge(true)
      .pointAltitude(0)
      .pointRadius(2);

    globeRef.current
      .ringsData([])
      .ringColor(() => config.polygonColor)
      .ringMaxRadius(config.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((config.arcTime * config.arcLength) / config.rings);

    globeRef.current
      .labelsData(markers.filter((marker) => marker.label))
      .labelLat((item: unknown) => (item as GlobeMarker).lat)
      .labelLng((item: unknown) => (item as GlobeMarker).lng)
      .labelText((item: unknown) => (item as GlobeMarker).label)
      .labelColor(() => "#e0f2fe")
      .labelAltitude(0.08)
      .labelSize(1.35)
      .labelIncludeDot(true)
      .labelDotRadius(0.42)
      .labelDotOrientation("top");

    globeRef.current
      .objectsData(markers.filter((marker) => marker.imageUrl))
      .objectLat((item: unknown) => (item as GlobeMarker).lat)
      .objectLng((item: unknown) => (item as GlobeMarker).lng)
      .objectAltitude((item: unknown) => (item as GlobeMarker).imageAltitude ?? 0.18)
      .objectFacesSurface(false)
      .objectThreeObject((item: object): Object3D => {
        const marker = item as GlobeMarker;
        const texture = createAvatarTexture(marker.imageUrl ?? "", marker.imageGlowColor);
        const material = new SpriteMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
        });
        const sprite = new Sprite(material);
        const markerSize = marker.imageSize ?? 18;
        sprite.scale.set(markerSize, markerSize, 1);
        return sprite;
      });
  }, [config, data, isActive, isInitialized, markers]);

  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data.length || !isActive) return;

    const interval = window.setInterval(() => {
      if (!globeRef.current) return;

      const offset = ringTickRef.current % data.length;
      ringTickRef.current += 1;

      const ringsData = data
        .filter((_, index) => (index + offset) % 5 !== 0)
        .map((item) => ({
          lat: item.startLat,
          lng: item.startLng,
          color: item.color,
        }));

      globeRef.current.ringsData(ringsData);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [data, isActive, isInitialized]);

  return <group ref={groupRef} scale={scale} />;
}

function createAvatarTexture(imageUrl: string, glowColor = "#a78bfa") {
  const canvas = document.createElement("canvas");
  const size = 160;
  const center = size / 2;
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) return new TextureLoader().load(imageUrl);

  const texture = new CanvasTexture(canvas);
  const paintFallback = () => {
    const gradient = context.createRadialGradient(center, center, 12, center, center, center);
    gradient.addColorStop(0, "#fef3c7");
    gradient.addColorStop(0.5, glowColor);
    gradient.addColorStop(1, "#2563eb");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(center, center, 68, 0, Math.PI * 2);
    context.fill();
    texture.needsUpdate = true;
  };

  paintFallback();

  const image = new window.Image();
  image.crossOrigin = "anonymous";
  image.onload = () => {
    context.clearRect(0, 0, size, size);

    const glow = context.createRadialGradient(center, center, 48, center, center, 78);
    glow.addColorStop(0, "rgba(255,255,255,0.96)");
    glow.addColorStop(0.62, glowColor);
    glow.addColorStop(1, "rgba(37,99,235,0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(center, center, 78, 0, Math.PI * 2);
    context.fill();

    const avatarRadius = 58;
    context.save();
    context.beginPath();
    context.arc(center, center, avatarRadius, 0, Math.PI * 2);
    context.clip();

    const imageRatio = image.width / image.height;
    const targetSize = avatarRadius * 2;
    const drawWidth = imageRatio > 1 ? targetSize * imageRatio : targetSize;
    const drawHeight = imageRatio > 1 ? targetSize : targetSize / imageRatio;
    context.drawImage(
      image,
      center - drawWidth / 2,
      center - drawHeight / 2,
      drawWidth,
      drawHeight,
    );
    context.restore();

    context.lineWidth = 8;
    context.strokeStyle = "rgba(255,255,255,0.94)";
    context.beginPath();
    context.arc(center, center, avatarRadius + 3, 0, Math.PI * 2);
    context.stroke();

    texture.needsUpdate = true;
  };
  image.src = imageUrl;

  return texture;
}

function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    const maxPixelRatio = size.width < 640 ? 1 : size.width < 1024 ? 1.25 : 1.5;

    gl.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, [gl, size.height, size.width]);

  return null;
}

function GlobeControls({
  globeConfig,
  isActive,
}: {
  globeConfig: GlobeConfig;
  isActive: boolean;
}) {
  const { size } = useThree();
  const isSmallCanvas = size.width < 640;

  return (
    <OrbitControls
      autoRotate={isActive && !isSmallCanvas && (globeConfig.autoRotate ?? true)}
      autoRotateSpeed={isSmallCanvas ? 0.2 : (globeConfig.autoRotateSpeed ?? 1)}
      enablePan={false}
      enableZoom={false}
      maxDistance={CAMERA_Z}
      maxPolarAngle={Math.PI - Math.PI / 3}
      minDistance={CAMERA_Z}
      minPolarAngle={Math.PI / 3.5}
    />
  );
}

export function World({ globeConfig, data, isActive = true, markers }: WorldProps) {
  const scene = useMemo(() => {
    const nextScene = new Scene();
    nextScene.fog = new Fog(0xffffff, 400, 2000);
    return nextScene;
  }, []);

  return (
    <Canvas
      scene={scene}
      camera={{ fov: 50, near: 1, far: 2000, position: [0, 0, CAMERA_Z] }}
      dpr={[1, 1.35]}
      frameloop={isActive ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
    >
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        intensity={0.8}
        position={new Vector3(-200, 500, 200)}
      />
      <Globe
        globeConfig={globeConfig}
        data={data}
        isActive={isActive}
        markers={markers}
      />
      <GlobeControls globeConfig={globeConfig} isActive={isActive} />
    </Canvas>
  );
}
