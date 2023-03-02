import { useDispatch,useSelector } from 'react-redux';
import { saveScene } from '../features/authSlice';
import { useState} from 'react'
function SaveBuild(props) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    sceneName: '',
  })
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }
  const { sceneName } = formData
  const { user} = useSelector(
    (state) => state.auth
  )
  const onSubmit = (e)=> {
    
    
    e.preventDefault()
    var nList = []

    const sModel ={
      userId: user._id,
      sceneName: sceneName,
    }
    for(var i = 0; i < props.myProp.length; i++){
      var t = {
        objType: "",
        position: "",
        rotation: "",
      }
      t.objType = props.myProp[i].objType
      t.position = props.myProp[i].obj.position
      t.rotation = props.myProp[i].obj.rotation
      nList.push(t)
    }
    sModel.objs = nList

    dispatch(saveScene(sModel));
  }
  
  return (
    
   <div>
       <form onSubmit={onSubmit}>
       <input
              type='sceneName'
              className='form-control'
              id='sceneName'
              name='sceneName'
              placeholder='Enter a name for the scene'
              onChange={onChange}
            />
      <button type='submit' className='btn-block'>
              Submit
            </button>
      </form>
    </div>
  );
}

export default SaveBuild;