import { useMemo } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import {
  makeArdalanSign,
  makeBannerArt,
  makeBannerDistrict,
  makeBloomMap,
  makeBrickFacadeMap,
  makeCreamStuccoMap,
  makeFoliageCardMap,
  makeFountainInscription,
  makeRoomAtlas,
} from "./canvasTextures";

function prep(tex: THREE.Texture, repeatX: number, repeatY: number) {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function interiorGlass(atlas: THREE.Texture, cell: [number, number]) {
  const mat = new THREE.MeshPhysicalMaterial({
    color: "#1a2226",
    roughness: 0.08,
    metalness: 0.12,
    clearcoat: 0.72,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.94,
    envMapIntensity: 1.45,
    map: atlas,
  });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uCell = { value: new THREE.Vector2(cell[0], cell[1]) };
    shader.uniforms.uDepth = { value: 0.2 };
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform vec2 uCell;
uniform float uDepth;`,
      )
      .replace(
        "#include <map_fragment>",
        `
        vec2 roomUv = vMapUv * 0.48 + uCell * 0.5 + 0.01;
        vec3 viewN = normalize(vViewPosition);
        roomUv += viewN.xy * uDepth * 0.32;
        roomUv = clamp(roomUv, uCell * 0.5 + 0.02, uCell * 0.5 + 0.48);
        vec4 room = texture2D(map, roomUv);
        float fres = pow(clamp(1.0 - abs(viewN.z), 0.0, 1.0), 2.4);
        vec3 glassTint = vec3(0.42, 0.50, 0.54);
        diffuseColor.rgb = mix(room.rgb * 0.42, glassTint, fres * 0.38);
        diffuseColor.a = 0.94;
        `,
      );
  };
  mat.customProgramCacheKey = () => `interior-glass-${cell[0]}-${cell[1]}`;
  return mat;
}

export type PlazaMats = ReturnType<typeof usePlazaMaterials>;

const TEXTURE_URLS = [
  "/textures/limestone.jpg",
  "/textures/brick_paver.jpg",
  "/textures/asphalt.jpg",
  "/textures/wood_floor.jpg",
  "/textures/plaster.jpg",
  "/textures/metal.jpg",
  "/textures/foliage.jpg",
  "/textures/hedge.jpg",
] as const;

export function usePlazaMaterials() {
  const [limestone, brick, asphalt, wood, plaster, metal, foliage, hedge] = useLoader(
    THREE.TextureLoader,
    [...TEXTURE_URLS],
  );

  return useMemo(() => {
    prep(limestone, 3, 2.4);
    prep(brick, 14, 8);
    prep(asphalt, 10, 6);
    prep(wood, 6, 8);
    prep(plaster, 2, 2);
    prep(metal, 2, 2);
    prep(foliage, 2, 2);
    prep(hedge, 3, 2);

    const creamMap = makeCreamStuccoMap();
    const roomAtlas = makeRoomAtlas();
    const foliageCardMap = makeFoliageCardMap();
    const bloomMap = makeBloomMap();
    const brickFacadeMap = makeBrickFacadeMap();
    const bannerArtMap = makeBannerArt();
    const bannerDistrictMap = makeBannerDistrict();
    const signMap = makeArdalanSign();
    const inscriptionMap = makeFountainInscription();

    const stucco = new THREE.MeshStandardMaterial({
      map: creamMap,
      color: "#f6f1e8",
      roughness: 0.84,
      metalness: 0.02,
      envMapIntensity: 0.42,
    });
    const limestoneMat = new THREE.MeshStandardMaterial({
      map: limestone,
      color: "#f0e6d4",
      roughness: 0.76,
      metalness: 0.03,
      envMapIntensity: 0.48,
    });
    const roof = new THREE.MeshStandardMaterial({
      color: "#3c4248",
      roughness: 0.82,
      metalness: 0.08,
      envMapIntensity: 0.4,
    });
    const copper = new THREE.MeshStandardMaterial({
      color: "#3d6b54",
      roughness: 0.46,
      metalness: 0.58,
      envMapIntensity: 0.95,
    });
    const brickMat = new THREE.MeshStandardMaterial({
      map: brick,
      color: "#d8c4a8",
      roughness: 0.9,
      metalness: 0.0,
    });
    const brickFacade = new THREE.MeshStandardMaterial({
      map: brickFacadeMap,
      color: "#c88862",
      roughness: 0.86,
      metalness: 0.02,
    });
    const brickTan = new THREE.MeshStandardMaterial({
      map: brickFacadeMap,
      color: "#d4a882",
      roughness: 0.84,
      metalness: 0.02,
    });
    const asphaltMat = new THREE.MeshStandardMaterial({
      map: asphalt,
      color: "#7a746c",
      roughness: 0.94,
      metalness: 0.0,
    });
    const woodMat = new THREE.MeshStandardMaterial({
      map: wood,
      color: "#8a5a38",
      roughness: 0.55,
      metalness: 0.02,
    });
    const plasterMat = new THREE.MeshStandardMaterial({
      map: plaster,
      color: "#f4f0e8",
      roughness: 0.86,
      metalness: 0.0,
    });
    const trim = new THREE.MeshStandardMaterial({
      color: "#f8f4ec",
      roughness: 0.46,
      metalness: 0.04,
      envMapIntensity: 0.6,
    });
    const bronze = new THREE.MeshStandardMaterial({
      map: metal,
      color: "#2a241c",
      roughness: 0.38,
      metalness: 0.55,
    });
    const shutter = new THREE.MeshStandardMaterial({
      color: "#2c2824",
      roughness: 0.55,
      metalness: 0.08,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: "#152028",
      roughness: 0.06,
      metalness: 0.14,
      clearcoat: 0.6,
      clearcoatRoughness: 0.12,
      transparent: true,
      opacity: 0.7,
      envMapIntensity: 1.7,
    });
    const interiors = [
      interiorGlass(roomAtlas, [0, 0]),
      interiorGlass(roomAtlas, [1, 0]),
      interiorGlass(roomAtlas, [0, 1]),
      interiorGlass(roomAtlas, [1, 1]),
    ];
    const darkInterior = new THREE.MeshStandardMaterial({
      color: "#12100e",
      roughness: 0.92,
      metalness: 0,
    });
    const glow = new THREE.MeshStandardMaterial({
      color: "#ffc48a",
      emissive: "#ffb070",
      emissiveIntensity: 0,
      roughness: 0.62,
    });
    const foliageMat = new THREE.MeshStandardMaterial({
      map: foliage,
      color: "#4a5c32",
      roughness: 0.88,
    });
    const foliageDark = new THREE.MeshStandardMaterial({
      map: foliage,
      color: "#2f3f22",
      roughness: 0.92,
    });
    const foliageLit = new THREE.MeshStandardMaterial({
      map: foliage,
      color: "#5c6e3c",
      roughness: 0.84,
    });
    const foliageCard = new THREE.MeshStandardMaterial({
      map: foliageCardMap,
      color: "#5a6e3a",
      roughness: 0.9,
      transparent: true,
      alphaTest: 0.28,
      depthWrite: true,
      side: THREE.DoubleSide,
    });
    const hedgeMat = new THREE.MeshStandardMaterial({
      map: hedge,
      color: "#3d5e36",
      roughness: 0.88,
    });
    const grass = new THREE.MeshStandardMaterial({
      color: "#6e7a50",
      roughness: 0.95,
    });
    const bloom = new THREE.MeshStandardMaterial({
      map: bloomMap,
      color: "#f2eee6",
      roughness: 0.7,
      transparent: true,
      alphaTest: 0.2,
      side: THREE.DoubleSide,
    });
    const water = new THREE.MeshPhysicalMaterial({
      color: "#9ec9c0",
      roughness: 0.04,
      metalness: 0.06,
      transparent: true,
      opacity: 0.48,
      envMapIntensity: 1.85,
      clearcoat: 0.55,
      clearcoatRoughness: 0.12,
      emissive: "#7aa8a0",
      emissiveIntensity: 0.12,
    });
    const iron = new THREE.MeshStandardMaterial({
      color: "#1a1816",
      roughness: 0.45,
      metalness: 0.6,
    });
    const umbrella = new THREE.MeshStandardMaterial({
      color: "#f6f1e8",
      roughness: 0.68,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });
    const bannerArt = new THREE.MeshStandardMaterial({
      map: bannerArtMap,
      roughness: 0.7,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });
    const bannerDistrict = new THREE.MeshStandardMaterial({
      map: bannerDistrictMap,
      roughness: 0.7,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });
    const ardalanSign = new THREE.MeshStandardMaterial({
      map: signMap,
      transparent: true,
      alphaTest: 0.2,
      roughness: 0.42,
      metalness: 0.08,
      emissive: "#f4efe6",
      emissiveIntensity: 0.22,
    });
    const inscription = new THREE.MeshStandardMaterial({
      map: inscriptionMap,
      transparent: true,
      alphaTest: 0.25,
      roughness: 0.55,
      metalness: 0.04,
    });
    const awning = new THREE.MeshStandardMaterial({
      color: "#3a2e26",
      roughness: 0.7,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });

    return {
      stucco,
      limestone: limestoneMat,
      roof,
      copper,
      brick: brickMat,
      brickFacade,
      brickTan,
      asphalt: asphaltMat,
      wood: woodMat,
      plaster: plasterMat,
      trim,
      bronze,
      shutter,
      glass,
      interiors,
      darkInterior,
      glow,
      foliage: foliageMat,
      foliageDark,
      foliageLit,
      foliageCard,
      hedge: hedgeMat,
      grass,
      bloom,
      water,
      iron,
      umbrella,
      bannerArt,
      bannerDistrict,
      ardalanSign,
      inscription,
      awning,
    };
  }, [limestone, brick, asphalt, wood, plaster, metal, foliage, hedge]);
}

