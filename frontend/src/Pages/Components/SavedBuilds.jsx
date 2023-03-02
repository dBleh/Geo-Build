import { useDispatch,useSelector } from 'react-redux';
import { getScene, saveScene, sceneNames } from '../../features/authSlice';
import { useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';

function SavedBuilds() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { user, sceneTitles} = useSelector(
    (state) => state.auth
  )
  useEffect(() => {
    dispatch(sceneNames(user._id))
  }, [])
  const onClick = (e) =>{
    const req={
      sName:e,
      userId:user._id
    }
    dispatch(getScene(req))
    navigate('/workspace')
  }
  
  return (
    
      
        <div className='savedScenes'>
      {sceneTitles ? sceneTitles.map((title) => (
        <div onClick={() => onClick(title)} key={title}>{title}</div>
      )): null}
    </div>

  );
}

export default SavedBuilds;