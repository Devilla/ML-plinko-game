const outputs = [];
const predictionPoint = 300;
const k = 3;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([...arguments]);
}

function runAnalysis() {
  // bucket element might fall into based on three nearest neighbors' buckets
  const bucket = _.chain(outputs)
            .map(row => [distancePoint(row[0]), row[3]])
            // sort by abs dropPosition
            .sortBy(row => row[0])
            // slice from 0 to k nearest neighbors
            .slice(0,k)
            // count how many times a ball landed into bucket 
            .countBy(row => row[1])
            // make an array from the object output from countBy
            .toPairs()
            // sort by amount of occurences per bucket
            .sortBy(row => row[1])
            // grab the bucket with the greatest occurences
            .last()
            // take the first element in the pair which is the bucket number
            .first()
            // parse the element from a stringified key to an integer
            .parseInt()
            // end the chain by returning a value()
            .value()
    console.log(`Your ball will probably fall in bucket #${bucket}`);
}

function distancePoint (point) {
  return Math.abs(point - predictionPoint);
}

function splitDataSet (data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}