https://medium.com/nongaap/beginners-guide-to-writing-mongodb-mongoose-unit-tests-using-mocha-chai-ab5bdf3d3b1d

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mocha = require('mocha');
var chai = require('chai');
var expect= chai.expect;

const testSchema = new Schema({
    name: { type: String, required: true }
  });
var Name = mongoose.model('Name', testSchema);


describe('database Tests', function(){
    before(function (done) {
        mongoose.connect('mongodb://localhost:27017/testDatabase', {useNewUrlParser: true});
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function() {
          console.log('We are connected to test database!');
          done();
        });
      });

    describe('Test Database', function(){

        it('Save new name to database', function(done){
            var testName = Name({
                name: 'Mike'
            });
            testName.save(done);
        });

  
        it('Dont save incorrect format to database', function(done) {
            var wrongSave = Name({
              notName: 'Not Mike'
            });
            wrongSave.save(err => {
              if(err) { return done(); }
              throw new Error('Should generate error!');
            });
          });
          it('Should retrieve data from test database', function(done) {
            Name.find({name: 'Mike'}, (err, name) => {
              if(err) {throw err;}
              if(name.length === 0) {throw new Error('No data!');}
              done();
            });
          });
        });
        after(function(done){
          mongoose.connection.db.dropDatabase(function(){
            mongoose.connection.close(done);
          });
        });
      });
