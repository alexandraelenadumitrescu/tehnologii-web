import { View } from "lucide-react";
import router from "../server/router.mjs";

window.onload = function() {
    const getView=async view=>memorizer(await (await fetch('/views/${view}.html)).text());
    ,function render(view,data){
        $('#main').innerHTML=view.render(data);
    },
    async function getRecords(model,filter){
        const response=await fetch(`/models/${model}${filter?filter:''}`);
        return response.status===200?await response.json():[];
    },
    async function getRecord(model,id){
        if(id.length>0){
        const response=await fetch(`/models/${model}/${id}`);
        return response.status===200?await response.json():{};
        }else{
            return {};
        }
    },
    async function addRecord(model,record){
        if(record.id)delete record.id;
        const response=await fetch(`/models/${model}`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(record)
        });
        return response.status===201;
    }
    ,async function saveRecord(model,id,record){
        const response=await fetch(`/models/${model}/${id}`,{
            method:'PUT',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(record)
        });
        return response.status===204;
    }
    ,async function removeRecord(model,id){
        if(await $('dialog').confirmDialog(`Are you sure you want to delete this from ?${model}`)){
        const response=await fetch(`/models/${model}/${id}`,{
            method:'DELETE'
        });
        return response.status===204;
    }
    },
    async function loadBoard(){
        let view=await getView('board');
        let context={
            rooms:await getRecords('rooms'),
            
        };
        for(let room of context.rooms){
            room.sessions=await getRecords('sessions',`?roomId=${room.id}`);
    }
    render(view,{...context,width: context.rooms.length > 0 ? Math.trunc(100 / context.rooms.length) - 1 : 100});
      

}
router({
    'home':()=>loadBoard(),
    'add-session/:roomId':({roomId})=>loadForm('session','',roomId),
    'edit/:model/:id':({model,id})=>loadForm(model,id),
    'remove/:model/:id':async({model,id})=>{
        if(await removeRecord(model,id)){
            goTo('home');
        }
});
goTo('home');
    }
};
