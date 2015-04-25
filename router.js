/**
 * @file
 * Contains client side template+view config.
 */
/* globals Router */

//Route config below
Router.configure({
  layoutTemplate: 'base'
});
var OnBeforeActions = {
  loginRequired: function() {
    if (!Meteor.userId()) {
      this.render('hello');
    } else {
      this.next();
    }
  }
};
Router.onBeforeAction(OnBeforeActions.loginRequired, {
  except: ['index', 'users']
});

Router.route('/', function() {
  var user = Meteor.user();
  var yokes = Yokes.find({
    user: Meteor.userId()
  }, {
    sort: {
      createdAt: -1
    }
  });
  var userContext = Meteor.user() ? Meteor.userId : false;
  Session.set("userContext", userContext);
  this.render('home', {
    data: {
      pageOwner: true,
      userContext: Meteor.userId(),
      username: user && user.profile.name,
      yokes: yokes
    }
  });
}, {
  name: 'home'
});

Router.route('/users/:user_id', function() {
  var user = Meteor.users.findOne({
    _id: this.params.user_id
  });

  var yokes = Yokes.find({
    user: this.params.user_id
  }, {
    sort: {
      createdAt: -1
    }
  });

  var noYokes = yokes && yokes.fetch().length;

  this.render('home', {
    data: {
      pageOwner: false,
      userContext: this.params.user_id,
      username: user && user.profile.name,
      yokes: yokes,
      noYokes: (noYokes) ? false : true
    }
  });
}, {
  name: 'users',
});

Router.route('/following', function() {
  var pkg = new Array();
  Graph.find({
      user: Meteor.userId()
    })
    .fetch()
    .forEach(function(e) {
      // console.log(e);
      pkg.push(Meteor.users.findOne({
        _id: e.follows
      }));
    });
  this.render('userlist', {
    data: {
      title: "Following",
      users: pkg
    }
  });
});

Router.route('/followers', function() {
  var pkg = new Array();
  Graph.find({
      follows: Meteor.userId()
    })
    .fetch()
    .forEach(function(e) {
      // console.log(e);
      pkg.push(Meteor.users.findOne({
        _id: e.user
      }));
    });
  this.render('userlist', {
    data: {
      title: "Followers",
      users: pkg
    }
  });
});