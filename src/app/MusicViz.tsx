"use client";

import {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {createSphere} from "./components/Sphere";
import {createBackground} from "./components/Background";
import {createSpeakers, SpeakerLevel} from "./components/Speakers";

const MusicViz: React.FC = () => {
	const mountRef = useRef<HTMLDivElement | null>(null);
	const [audioFile, setAudioFile] = useState<string | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);

	useEffect(() => {
		if (!mountRef.current) return;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(window.innerWidth, window.innerHeight);
		mountRef.current.appendChild(renderer.domElement);
		camera.position.z = 100;

		// Lighting
		const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
		scene.add(ambientLight);
		const pointLight = new THREE.PointLight(0xffffff, 1, 200);
		pointLight.position.set(50, 50, 50);
		scene.add(pointLight);

		// Initialize visualization components
		const {particleSystem, update: updateSphere} = createSphere(10000, 40);
		scene.add(particleSystem);

		const {backgroundSystem, update: updateBackground} = createBackground(2000);
		scene.add(backgroundSystem);

		const speakerLevels: SpeakerLevel[] = [
			{count: 4, baseSize: 8, yPos: -80, freqRange: [0, 0.33], baseColor: 0xffa500},
			{count: 6, baseSize: 5, yPos: 10, freqRange: [0.33, 0.66], baseColor: 0x00ffff},
			{count: 8, baseSize: 3, yPos: 80, freqRange: [0.66, 1.0], baseColor: 0x87ceeb},
		];
		const {update: updateSpeakers} = createSpeakers(scene, speakerLevels);

		let animationFrameId: number;
		let rotationAngle = 0;
		const animate = () => {
			animationFrameId = requestAnimationFrame(animate);

			if (analyserRef.current) {
				const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
				analyserRef.current.getByteFrequencyData(dataArray);

				updateSphere(dataArray);
				updateSpeakers(dataArray, rotationAngle);
				updateBackground(dataArray, Date.now());

				particleSystem.rotation.y += 0.005;
				rotationAngle += 0.005;
			}

			renderer.render(scene, camera);
		};
		animate();

		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.addEventListener("resize", handleResize);

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener("resize", handleResize);
			if (mountRef.current) {
				mountRef.current.removeChild(renderer.domElement);
			}
		};
	}, []);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setAudioFile(url);
			setIsPlaying(false);
		}
	};

	useEffect(() => {
		if (audioFile && !audioRef.current) {
			const audio = new Audio(audioFile);
			audioRef.current = audio;

			const audioContext = new AudioContext();
			const source = audioContext.createMediaElementSource(audio);
			const analyser = audioContext.createAnalyser();
			analyser.fftSize = 256;
			source.connect(analyser);
			analyser.connect(audioContext.destination);
			analyserRef.current = analyser;

			audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
			audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
			audio.addEventListener("ended", () => setIsPlaying(false));
		}
	}, [audioFile]);

	const togglePlayPause = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (audioRef.current) {
			const newTime = Number(event.target.value);
			audioRef.current.currentTime = newTime;
			setCurrentTime(newTime);
		}
	};

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
	};

	return (
		<div style={{position: "relative", height: "100vh"}}>
			<input type="file" accept="audio/*" onChange={handleFileChange} style={{position: "absolute", top: 10, left: 10, zIndex: 2}} />
			<div ref={mountRef} style={{width: "100vw", height: "100vh"}} />
			{audioFile && (
				<div
					style={{
						position: "fixed",
						bottom: 20,
						left: "50%",
						transform: "translateX(-50%)",
						width: "80%",
						maxWidth: 600,
						background: "rgba(0, 0, 0, 0.8)",
						borderRadius: 10,
						padding: "10px 20px",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						color: "#fff",
						boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
						zIndex: 2,
					}}>
					<button onClick={togglePlayPause} style={{background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer"}}>
						{isPlaying ? "⏸" : "▶"}
					</button>
					<div style={{flex: 1, margin: "0 10px"}}>
						<input type="range" min={0} max={duration} value={currentTime} onChange={handleSeek} style={{width: "100%", cursor: "pointer"}} />
					</div>
					<span style={{fontSize: 14}}>
						{formatTime(currentTime)} / {formatTime(duration)}
					</span>
				</div>
			)}
		</div>
	);
};

export default MusicViz;
