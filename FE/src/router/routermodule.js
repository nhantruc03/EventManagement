import React, { Component } from 'react';
import login from '../components/web/login/login';
import loginpage from '../components/web/login/pagelogin';
import loginfail from '../components/web/loginfail';
// import { SecureRouteAdmin } from './secureRoute'
// import { SecureRouteDoctor } from './secureRouteDoctor'
// import { SecureRoutePharmacist } from './secureRoutePharmacist'
import Page from '../components/web/page';
import { SecureRouteStaff } from './secureRouteStaff'
import { SecureRouteAdmin } from './secureRoute'
import { AppRoute } from './AppRoute';


import trangchu from '../components/web/home/home';
import thongtincanhan from '../components/web/thongtincanhan/thongtincanhan';

import addusers from '../components/web/users/add';
import editusers from '../components/web/users/edit';
import users from '../components/web/users/list';

import addroles from '../components/web/roles/add';
import editroles from '../components/web/roles/edit';
import roles from '../components/web/roles/list';

import addEventTypes from '../components/web/eventTypes/add';
import editEventTypes from '../components/web/eventTypes/edit';
import EventTypes from '../components/web/eventTypes/list';

import addTags from '../components/web/tags/add';
import editTags from '../components/web/tags/edit';
import Tags from '../components/web/tags/list';

import addActionTags from '../components/web/actionTags/add';
import editActionTags from '../components/web/actionTags/edit';
import ActionTags from '../components/web/actionTags/list';

import addActionPriorities from '../components/web/actionPriorities/add';
import editActionPriorities from '../components/web/actionPriorities/edit';
import ActionPriorities from '../components/web/actionPriorities/list';

import addFaculties from '../components/web/faculties/add';
import editFaculties from '../components/web/faculties/edit';
import Faculties from '../components/web/faculties/list';

import events from '../components/web/events/listevents/listevents'
import eventDetails from '../components/web/events/details/eventDetails'
import addevents from '../components/web/events/addevent/addevents'
import editevent from '../components/web/events/editevent/editevent'

import addscripts from '../components/web/eventScripts/add'
import editscripts from '../components/web/eventScripts/edit'

import listactions from '../components/web/actions/listactions/listactions'
import actiondetails from '../components/web/actions/actiondetails/actionDetails'

import event_videocall from '../components/web/chat/VideoCallRoom'
import action_videocall from '../components/web/actions/actiondetails/chat/VideoCallRoom'

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

                <SecureRouteAdmin exact path="/listactiontags" component={ActionTags} layout={Page} />
                <SecureRouteAdmin exact path="/addactiontags" component={addActionTags} layout={Page} />
                <SecureRouteAdmin exact path="/editactiontags/:id" component={editActionTags} layout={Page} />

                <SecureRouteAdmin exact path="/listactionpriorities" component={ActionPriorities} layout={Page} />
                <SecureRouteAdmin exact path="/addactionpriorities" component={addActionPriorities} layout={Page} />
                <SecureRouteAdmin exact path="/editactionpriorities/:id" component={editActionPriorities} layout={Page} />

                <SecureRouteAdmin exact path="/listfaculties" component={Faculties} layout={Page} />
                <SecureRouteAdmin exact path="/addfaculties" component={addFaculties} layout={Page} />
                <SecureRouteAdmin exact path="/editfaculties/:id" component={editFaculties} layout={Page} />

                <SecureRouteAdmin exact path="/events" component={events} layout={Page} />
                <SecureRouteAdmin exact path="/events/:id" component={eventDetails} layout={Page} />
                <SecureRouteAdmin exact path="/editevent/:id" component={editevent} layout={Page} />
                <SecureRouteAdmin exact path="/addevents" component={addevents} layout={Page} />
                
                <SecureRouteAdmin exact path="/addscripts/:id" component={addscripts} layout={Page} />
                <SecureRouteAdmin exact path="/editscripts/:id" component={editscripts} layout={Page} />


                <SecureRouteAdmin exact path="/actions" component={listactions} layout={Page} />
                <SecureRouteAdmin exact path="/actions/:id" component={actiondetails} layout={Page} />

                <SecureRouteAdmin exact path="/event-videocall/:id" component={event_videocall} layout={Page} />
                <SecureRouteAdmin exact path="/action-videocall/:id" component={action_videocall} layout={Page} />
                {/* <SecureRouteAdmin exact path="/actions/:id" component={eventDetails} layout={Page} />
                <SecureRouteAdmin exact path="/editactions/:id" component={editevent} layout={Page} /> */}
                {/* <SecureRouteAdmin exact path="/addactions" component={addactions} layout={Page} /> */}
            </div>

        );
    }
}

export default router;