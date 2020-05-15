export default function areParticlesIntersected(particle1, particle2) {
	return (
		Math.pow(particle1.x - particle2.x, 2) +
			Math.pow(particle1.y - particle2.y, 2) <
		Math.pow(particle1.size / 2 + particle2.size / 2, 2)
	);
}
