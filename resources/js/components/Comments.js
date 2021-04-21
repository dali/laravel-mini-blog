import React, { useCallback, useEffect, useRef } from 'react'
import { useFetch } from './hooks'
import { Field } from './Forms'



export const Comment = React.memo(({comment, onDelete, canEdit}) => {

    const date = new Date(comment.created_at)

    // Events

    const onDeleteCallback = useCallback(() => {
        onDelete(comment)
    }, [comment])

    const onComment = useCallback((newComment) => {
        onUpdate(newComment, comment)
    }, [comment])

    // hooks
    const {loading: loadingDelete, load: callDelete}   = useFetch('/comments/'+ comment.id, 'DELETE', onDeleteCallback)

    // Render

    return  <div className='alert alert-primary'>
                    <strong> { comment.user.name } </strong>
                    commenté le
                    <strong> { date.toLocaleString() } </strong>
                    
                    <p> { comment.name } </p> 
                    
                    { canEdit && <p>
                        <button className="btn btn-danger fload-right" onClick={callDelete.bind(this, null)} disabled={loadingDelete} >
                            Supprimer
                        </button>
                        
                        </p>}
                        
                </div> 
    
})


export const  CommentForm = React.memo(({status = null, onComment, comment = null, onCancel = null}) => {
    // Variables
    const ref = useRef(null)

    const onSuccess = useCallback(comment => {
        onComment(comment)
        ref.current.value = ''
    }, [ref, onComment])

    // Hooks
    const method = comment ? 'PUT' : 'POST'
    const url = comment ? comment.id : '/comments'
    const {load, loading, errors, clearError} = useFetch(url, method, onSuccess)

    // Methods


    const onSubmit = useCallback(e => {
        e.preventDefault()
        load({
            name: ref.current.value,
            status: status
        })
    }, [load, ref, status])


    // Effects

    useEffect(() => {
        if(comment && comment.name && ref.current){
            ref.current.value = comment.name
        }
    }, [comment, ref])





return <div className="well">
<form onSubmit={onSubmit}>
    <Field 
    name="name" 
    ref={ref} 
    required
    minLenght={5}
    onChange= {clearError.bind(this, 'name')}
    error={errors['name']}
    
    > Votre commentaire</Field>
    <div className="form-group">
        <button className="btn btn-primary" disabled={loading}>
            Envoyer
        </button>
   
    </div>
</form>
</div>
})