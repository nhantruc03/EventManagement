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

import addusers from '../components/users/add';
import editusers from '../components/users/edit';
import users from '../components/users/list';

import addroles from '../components/roles/add';
import editroles from '../components/roles/edit';
import roles from '../components/roles/list';

import addEventTypes from '../components/eventTypes/add';
import editEventTypes from '../components/eventTypes/edit';
import EventTypes from '../components/eventTypes/list';

import addTags from '../components/tags/add';
import editTags from '../components/tags/edit';
import Tags from '../components/tags/list';

import addActionTags from '../components/actionTags/add';
import editActionTags from '../components/actionTags/edit';
import ActionTags from '../components/actionTags/list';

import addActionPriorities from '../components/actionPriorities/add';
import editActionPriorities from '../components/actionPriorities/edit';
import ActionPriorities from '../components/actionPriorities/list';

import addFaculties from '../components/faculties/add';
import editFaculties from '../components/faculties/edit';
import Faculties from '../components/faculties/list';


import addcredentials from '../components/credentials/addcredentials';
import editcredentials from '../components/credentials/editcredentials';
import credentials from '../components/credentials/listcredentials';

import events from '../components/events/listevents/listevents'
import eventDetails from '../components/events/details/eventDetails'
import addevents from '../components/events/addevent/addevents'
import editevent from '../components/events/editevent/editevent'

import addscripts from '../components/eventScripts/add'
import editscripts from '../components/eventScripts/edit'

import listactions from '../components/actions/listactions/listactions'
import actiondetails from '../components/actions/actiondetails/actionDetails'

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
{/*  */}
                <SecureRouteAdmin exact path="/listactiontags" component={ActionTags} layout={Page} />
                <SecureRouteAdmin exact path="/addactiontags" component={addActionTags} layout={Page} />
                <SecureRouteAdmin exact path="/editactiontags/:id" component={editActionTags} layout={Page} />

                <SecureRouteAdmin exact path="/listactionpriorities" component={ActionPriorities} layout={Page} />
                <SecureRouteAdmin exact path="/addactionpriorities" component={addActionPriorities} layout={Page} />
                <SecureRouteAdmin exact path="/editactionpriorities/:id" component={editActionPriorities} layout={Page} />

                <SecureRouteAdmin exact path="/listfaculties" component={Faculties} layout={Page} />
                <SecureRouteAdmin exact path="/addfaculties" component={addFaculties} layout={Page} />
                <SecureRouteAdmin exact path="/editfaculties/:id" component={editFaculties} layout={Page} />

                <SecureRouteAdmin exact path="/listcredentials" component={credentials} layout={Page} />
                <SecureRouteAdmin exact path="/addcredentials" component={addcredentials} layout={Page} />
                <SecureRouteAdmin exact path="/editcredentials/:id" component={editcredentials} layout={Page} />

                <SecureRouteAdmin exact path="/events" component={events} layout={Page} />
                <SecureRouteAdmin exact path="/events/:id" component={eventDetails} layout={Page} />
                <SecureRouteAdmin exact path="/editevent/:id" component={editevent} layout={Page} />
                <SecureRouteAdmin exact path="/addevents" component={addevents} layout={Page} />
                
                <SecureRouteAdmin exact path="/addscripts/:id" component={addscripts} layout={Page} />
                <SecureRouteAdmin exact path="/editscripts/:id" component={editscripts} layout={Page} />


                <SecureRouteAdmin exact path="/actions" component={listactions} layout={Page} />
                <SecureRouteAdmin exact path="/actions/:id" component={actiondetails} layout={Page} />
                {/* <SecureRouteAdmin exact path="/actions/:id" component={eventDetails} layout={Page} />
                <SecureRouteAdmin exact path="/editactions/:id" component={editevent} layout={Page} /> */}
                {/* <SecureRouteAdmin exact path="/addactions" component={addactions} layout={Page} /> */}
            </div>

        );
    }
}

export default router;