module.exports = {
  name: 'ng-state',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ng-state',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
