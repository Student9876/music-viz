import * as THREE from 'three';

export function createBackground(particleCount: number) {
    const bgParticles = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
        bgParticles[i] = (Math.random() - 0.5) * 1000;
        bgParticles[i + 1] = (Math.random() - 0.5) * 1000;
        bgParticles[i + 2] = (Math.random() - 0.5) * 1000;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(bgParticles, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3));

    const material = new THREE.PointsMaterial({ size: 1, vertexColors: true, transparent: true, opacity: 0.7 });
    const backgroundSystem = new THREE.Points(geometry, material);

    const bgColors = geometry.attributes.color.array as Float32Array;
    for (let i = 0; i < particleCount * 3; i += 3) {
        bgColors[i] = 0.2;
        bgColors[i + 1] = 0.2;
        bgColors[i + 2] = 0.5;
    }

    function update(dataArray: Uint8Array, time: number) {
        const positions = geometry.attributes.position.array as Float32Array;
        const avgFreq = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
        for (let i = 0; i < particleCount * 3; i += 3) {
            const pulse = Math.sin(time * 0.001 + i) * avgFreq * 2;
            positions[i + 2] = bgParticles[i + 2] + pulse;
            bgColors[i] = 0.2 + avgFreq * 0.8;
            bgColors[i + 1] = 0.2 + avgFreq * 0.6;
            bgColors[i + 2] = 0.5 + avgFreq * 0.5;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
    }

    return { backgroundSystem, update };
}