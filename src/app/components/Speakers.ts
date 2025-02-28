import * as THREE from 'three';

export interface SpeakerLevel {
    count: number;
    baseSize: number;
    yPos: number;
    freqRange: [number, number];
    baseColor: number;
}

export function createSpeakers(scene: THREE.Scene, levels: SpeakerLevel[]) {
    const speakerGroups: THREE.Group[] = [];

    levels.forEach((level) => {
        const group = new THREE.Group();
        for (let i = 0; i < level.count; i++) {
            const speakerGroup = new THREE.Group();
            const ringCount = 5;
            for (let j = 0; j < ringCount; j++) {
                const ringSize = level.baseSize * (0.5 + j * 0.2);
                const ringGeometry = new THREE.TorusGeometry(ringSize, 0.2, 8, 32);
                const ringMaterial = new THREE.MeshBasicMaterial({ color: level.baseColor });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.position.z = j * 0.5;
                speakerGroup.add(ring);
            }
            const angle = (i / level.count) * Math.PI * 2;
            speakerGroup.position.set(
                Math.cos(angle) * 100,
                level.yPos,
                Math.sin(angle) * 100
            );
            group.add(speakerGroup);
        }
        scene.add(group);
        speakerGroups.push(group);
    });

    function update(dataArray: Uint8Array, rotationAngle: number) {
        speakerGroups.forEach((group, levelIndex) => {
            const level = levels[levelIndex];
            const startBin = Math.floor(level.freqRange[0] * dataArray.length);
            const endBin = Math.floor(level.freqRange[1] * dataArray.length);
            let freqSum = 0;
            for (let i = startBin; i < endBin; i++) freqSum += dataArray[i];
            const avgFreq = freqSum / (endBin - startBin) / 255;

            group.children.forEach((speaker, i) => {
                const angle = (i / level.count) * Math.PI * 2 + rotationAngle;
                speaker.position.set(
                    Math.cos(angle) * 100,
                    level.yPos,
                    Math.sin(angle) * 100
                );
                const scale = 1 + avgFreq * 1.5;
                speaker.scale.set(scale, scale, scale);

                // Update ring colors
                (speaker.children as THREE.Mesh[]).forEach((ring) => {
                    const material = ring.material as THREE.MeshBasicMaterial;
                    let color: THREE.Color;
                    if (levelIndex === 0) {
                        color = new THREE.Color(1.0, 0.647, 0.0).multiplyScalar(0.8 + avgFreq * 0.2);
                    } else if (levelIndex === 1) {
                        color = new THREE.Color(0.0, 1.0, 1.0).multiplyScalar(0.8 + avgFreq * 0.2);
                    } else {
                        color = new THREE.Color(0.529, 0.808, 0.922).multiplyScalar(0.8 + avgFreq * 0.2);
                    }
                    material.color.set(color);
                });
            });
        });
    }

    return { update };
}