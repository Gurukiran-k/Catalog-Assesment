const fs = require('fs');
const math = require('mathjs');

function decodeValue(base, value) {
    return parseInt(value, parseInt(base));
}

function lagrangeInterpolation(points) {
    const x = math.subset(points, math.index(math.range(0, points.length), 0));
    const y = math.subset(points, math.index(math.range(0, points.length), 1));

    return function(xi) {
        let result = 0;
        for (let i = 0; i < points.length; i++) {
            let term = y[i];
            for (let j = 0; j < points.length; j++) {
                if (i !== j) {
                    term *= (xi - x[j]) / (x[i] - x[j]);
                }
            }
            result += term;
        }
        return result;
    };
}

function findSecret(data) {
    const { keys, ...points } = data;
    const { k } = keys;

    const decodedPoints = Object.entries(points)
        .map(([x, { base, value }]) => [parseInt(x), decodeValue(base, value)])
        .slice(0, k);

    const polynomial = lagrangeInterpolation(decodedPoints);
    return Math.round(polynomial(0));
}

function findWrongPoints(data) {
    const { keys, ...points } = data;
    const { k } = keys;

    const decodedPoints = Object.entries(points)
        .map(([x, { base, value }]) => [parseInt(x), decodeValue(base, value)]);

    const polynomial = lagrangeInterpolation(decodedPoints.slice(0, k));
    
    return decodedPoints.filter(([x, y]) => {
        const calculatedY = polynomial(x);
        return Math.abs(calculatedY - y) > 1e-6;
    });
}

function main() {
    const testCase1 = JSON.parse(fs.readFileSync('testcase1.json', 'utf8'));
    const testCase2 = JSON.parse(fs.readFileSync('testcase2.json', 'utf8'));

    const secret1 = findSecret(testCase1);
    const secret2 = findSecret(testCase2);

    console.log('Secret for Test Case 1:', secret1);
    console.log('Secret for Test Case 2:', secret2);

    const wrongPoints = findWrongPoints(testCase2);
    console.log('Wrong points in Test Case 2:', wrongPoints);
}

main();