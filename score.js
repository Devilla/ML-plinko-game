const outputs = [];
const predictionPoint = 300;


function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([...arguments]);
}

function runAnalysis() {
  const testSize = 10;
  const [testSet, trainingSet] = splitDataSet(outputs, testSize);
  _.range(1,15).forEach(k => {
    const accuracy = _.chain(testSet)
                      // take the training set and the dropPoint from each test set and compare the result to the testSet's bucket
                      .filter(testPoint => knn(trainingSet, testPoint[0], k) === testPoint[3])
                      // get the size of the array of matching test and training buckets
                      .size()
                      // divide the size by the testSize i.e. 4 correct / 10 total = 40% accurate
                      .divide(testSize)
                      .value()
    console.log('Accuracy: ', accuracy);
  })
  
}

function knn (data, point, k) {
  return _.chain(data)
            .map(row => [distancePoint(row[0], point), row[3]])
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
}

function distancePoint (pointA, pointB) {
  return Math.abs(pointA - pointB);
}

function splitDataSet (data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}