export default function areParticlesIntersected(
	particle1,
	particle2,
	tolerance = 0
) {
	const isParticle1Bigger = particle1.size > particle2.size;
	const smallerParticle = isParticle1Bigger ? particle2 : particle1;
	const differenceInX = particle1.x - particle2.x;
	const differenceInY = particle1.y - particle2.y;
	const distanceBetweenParticles = particle1.size / 2 + particle2.size / 2;
	const toleratedDistance =
		distanceBetweenParticles - tolerance * smallerParticle.size;
	return (
		Math.pow(differenceInX, 2) + Math.pow(differenceInY, 2) <
		Math.pow(toleratedDistance, 2)
	);
}
