import { render, unmountComponentAtNode } from 'react-dom'
import React, { useCallback, useEffect, useRef } from 'react'
import { useFetch, useStatusesFetch, useCommentsFetch   } from './hooks'
import { Comment, CommentForm } from './Comments'
import { Field } from './Forms'


function Statuses({user}) {

    const {items: statuses, load, loading , setItems: setStatuses} = useStatusesFetch
    ('/statuses' )

  
    const addStatus = useCallback(status => {
        setStatuses(statuses => [status, ...statuses])
    }, [])

    const deleteStatus = useCallback(status => {
        setStatuses(statuses => statuses.filter(s => s !== status))
    }, [])



    useEffect(() => {
        load()
        }, [])


    return <div> 
        
        { loading && 'Chargement....'}
        <StatusForm  user={user} status={status.id}  onStatus={addStatus} /> 
        {statuses.map(s => 
            <Status key={s.id} user={user} status={s} onDelete={deleteStatus} canEdit={s.user.id === user} 
        />)}
        
    </div>
}
// fonction qui sert a afficher chaque status on utilisant react.memo 
//pour eviter le rendu a chaque iteration de status

const Status = React.memo(({user, status, onDelete, canEdit}) => {

    const date = new Date(status.created_at)

    const { comments: comments, load, setComments: setComments, loading} = useCommentsFetch
    ('/comments/status/' + status.id)

    // rendu le status apres la suppression

    const onDeleteCallback = useCallback(() => {
        onDelete(status)
    }, [status])

    // Ajouter d'un commentaire
    const addComment = useCallback(comment => {
        setComments(comments => [comment, ...comments])
    }, [])

     // Suppression d'un commentaire
    const deleteComment = useCallback(comment => {
        setComments(comments => comments.filter(c => c !== comment))
    }, [])

    useEffect(() => {
        load()
        }, [])

    
    const {loading: loadingDelete, load: callDelete}   = useFetch('/statuses/' + status.id, 'DELETE', onDeleteCallback)

    // retourne l'affichage d'un status avec ses commentaire

    return <div className="container">
        <div  key={status.id} className="row justify-content-center mb-3">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-header">
                    [{  date.toLocaleString() }] {''}
                        {status.user.name}
                        {canEdit && 
                            <button className="btn btn-sm btn-danger float-right" onClick={callDelete.bind(this, null)} disabled={loadingDelete} >
                                Supprimer
                            </button>
                        }
                       
                    </div>
                    <div className="card-body">
                    
                        {status.name} {' '}
                       
                       {
                        comments.map(c => 
                            <Comment 
                                key={c.id} 
                                comment={c} 
                                onDelete={deleteComment} 
                                canEdit={c.user.id === user}
                            />
                        )}
                        <CommentForm status={status.id} onComment={addComment}  /> 
                    </div>
                    
                </div>
            </div>
        </div>
        </div>
    })

// fonction pour afficher le formulaire d'un status

const  StatusForm = React.memo(({user, status = null, onStatus , onCancel = null}) => {
    // Variables
    const ref = useRef(null)

    const onSuccess = useCallback(status => {
        onStatus(status)
        ref.current.value = ''
    }, [ref, onStatus])

    // Hooks
    const method = status ? 'PUT' : 'POST'
    const url = status ? status.id :'/statuses'
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
        if(status && status.name && ref.current){
            ref.current.value = status.name
        }
    }, [status, ref])





return <div className="container">
        <div className="row justify-content-center mb-3">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-header">Hi  {user} , what's new ?</div>
                    <div className="card-body">
       
                    <form onSubmit={onSubmit}>
                        <Field 
                        name="name" 
                        ref={ref} 
                        required
                        minLenght={5}
                        onChange= {clearError.bind(this, 'name')}
                        error={errors['name']}
                        
                        > </Field>
                        <div className="form-group">
                            <button className="btn btn-primary" disabled={loading}>
                            Envoyer
                            </button>
                           
                        </div>
                    </form>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
})





class StatusesElement extends HTMLElement{

    constructor(){
        super()
        this.observer = null
    }

    connectedCallback (){
        const status = parseInt(this.dataset.status, 10)
        const user = parseInt(this.dataset.user, 10) || null
        if(this.observer == null ){
            this.observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if(entry.isIntersecting && entry.target == this){
                        observer.disconnect()
                        render(<Statuses status={status} user={user} />, this)
                    }
                })
            })
        }

        this.observer.observe(this)
    }

    disconnectCallback(){
        if(this.observer){
            this.observer.disconnect()
        }
        unmountComponentAtNode(this)
    }
}

customElements.define('status-comments', StatusesElement)