//Determines whether a given page can be loaded based on the user state
export default function({store, route, redirect, ssrContext}){
    var layout = route.matched[0].components.default.extendOptions.layout
    if(store.state.authUser){ //If user in state
        var userType = store.state.authUser.type.toLowerCase() //Get type
        if(layout != userType){ //If currently on wrong part of the site
            return redirect((userType == 'admin')?'/admin/tribes':'/dashboard') //redirect based on user type
        }
    }else{
        if(layout != 'home'){
            return redirect('/')
        }
    }
}