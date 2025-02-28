import * as THREE from 'three';

export function createSphere(particleCount: number, radius: number) {
    const particles = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;
        particles[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        particles[i * 3 + 1] = radius * Math.cos(phi);
        particles[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(particles, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3));

    const material = new THREE.PointsMaterial({ size: 0.5, vertexColors: true });
    const particleSystem = new THREE.Points(geometry, material);

    const originalPositions = particles.slice();
    const sphereColors = geometry.attributes.color.array as Float32Array;

    // Initialize colors to white
    for (let i = 0; i < particleCount * 3; i += 3) {
        sphereColors[i] = 1.0;
        sphereColors[i + 1] = 1.0;
        sphereColors[i + 2] = 1.0;
    }

    function update(dataArray: Uint8Array) {
        const positions = geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount * 3; i += 3) {
            const index = Math.floor((i / 3) % dataArray.length);
            const freq = dataArray[index] / 255;
            const origX = originalPositions[i];
            const origY = originalPositions[i + 1];
            const origZ = originalPositions[i + 2];

            const displacement = freq * 10;
            const distance = Math.sqrt(origX * origX + origY * origY + origZ * origZ);
            const scale = 1 + displacement / distance;

            positions[i] = origX * scale;
            positions[i + 1] = origY * scale;
            positions[i + 2] = origZ * scale;

            // Update colors based on frequency
            const freqIndex = index / dataArray.length;
            let color: THREE.Color;
            if (freqIndex < 0.33) {
                color = new THREE.Color(1.0, 0.0, 0.0).multiplyScalar(freq);
            } else if (freqIndex < 0.66) {
                color = new THREE.Color(0.0, 1.0, 0.0).multiplyScalar(freq);
            } else {
                color = new THREE.Color(0.0, 0.0, 1.0).multiplyScalar(freq);
            }
            sphereColors[i] = color.r;
            sphereColors[i + 1] = color.g;
            sphereColors[i + 2] = color.b;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
    }

    return { particleSystem, update };
}