import React, { Component } from 'react';
import login from '../components/login/login';
import loginpage from '../components/login/pagelogin';
import loginfail from '../components/loginfail';
// import { SecureRouteAdmin } from './secureRoute'
// import { SecureRouteDoctor } from './secureRouteDoctor'
// import { SecureRoutePharmacist } from './secureRoutePharmacist'
import Page from '../components/page';
import { SecureRouteStaff } from './secureRouteStaff'
import { SecureRouteAdmin } from './secureRoute'
import { AppRoute } from './AppRoute';


import trangchu from '../components/home/home';
import thongtincanhan from '../components/thongtincanhan/thongtincanhan';

import addusers from '../components/users/addusers';
import editusers from '../components/users/editusers';
import users from '../components/users/listusers';

import addroles from '../components/roles/addroles';
import editroles from '../components/roles/editroles';
import roles from '../components/roles/listroles';

import addEventTypes from '../components/eventTypes/add';
import editEventTypes from '../components/eventTypes/edit';
import EventTypes from '../components/eventTypes/list';

import addTags from '../components/tags/add';
import editTags from '../components/tags/edit';
import Tags from '../components/tags/list';


import addcredentials from '../components/credentials/addcredentials';
import editcredentials from '../components/credentials/editcredentials';
import credentials from '../components/credentials/listcredentials';

import events from '../components/events/listevents/listevents'
import eventDetails from '../components/events/details/eventDetails'
import addevents from '../components/events/addevents'
class router extends Component {
    render() {
        return (
            <div>
                <SecureRouteStaff exact path="/" component={trangchu} layout={Page} />

              

                <AppRoute exact path="/login" component={login} layout={loginpage} />
                <AppRoute exact path="/khongcoquyen" component={loginfail} layout={Page} />

                <SecureRouteStaff exact path="/thongtincanhan" component={thongtincanhan} layout={Page} />

                <SecureRouteAdmin exact path="/listusers" component={users} layout={Page} />
                <SecureRouteAdmin exact path="/addusers" component={addusers} layout={Page} />
                <SecureRouteAdmin exact path="/editusers/:id" component={editusers} layout={Page} />

                <SecureRouteAdmin exact path="/listroles" component={roles} layout={Page} />
                <SecureRouteAdmin exact path="/addroles" component={addroles} layout={Page} />
                <SecureRouteAdmin exact path="/editroles/:id" component={editroles} layout={Page} />

                <SecureRouteAdmin exact path="/listEventTypes" component={EventTypes} layout={Page} />
                <SecureRouteAdmin exact path="/addEventTypes" component={addEventTypes} layout={Page} />
                <SecureRouteAdmin exact path="/editEventTypes/:id" component={editEventTypes} layout={Page} />

                <SecureRouteAdmin exact path="/listtags" component={Tags} layout={Page} />
                <SecureRouteAdmin exact path="/addtags" component={addTags} layout={Page} />
                <SecureRouteAdmin exact path="/edittags/:id" component={editTags} layout={Page} />

                <SecureRouteAdmin exact path="/listcredentials" component={credentials} layout={Page} />
                <SecureRouteAdmin exact path="/addcredentials" component={addcredentials} layout={Page} />
                <SecureRouteAdmin exact path="/editcredentials/:id" component={editcredentials} layout={Page} />

                <SecureRouteAdmin exact path="/events" component={events} layout={Page} />
                <SecureRouteAdmin exact path="/events/:id" component={eventDetails} layout={Page} />
                <SecureRouteAdmin exact path="/addevents" component={addevents} layout={Page} />


            </div>

        );
    }
}

export default router;