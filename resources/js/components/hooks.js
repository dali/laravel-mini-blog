import { useState, useCallback } from "react";

async function jsonFetch(url, method ='GET', data = null){

    const params = {
        method : method,
        headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json' 
        }
    }

    if (data){
        params.body = JSON.stringify(data)
    }
    const response  = await fetch(url, params)

    if (response.status === 204) {
        return null
    }

    const responseData = await response.json()
    if (response.ok){
        return responseData
    } else {
        throw responseData
    }

}

export function useStatusesFetch(url){
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([])
    const load = useCallback(async () => {

        setLoading(true)
        try {
        const response  = await jsonFetch( url)
        setItems(items => [...items, ...response.statuses])

        } catch(error) {
            console.error(error)
        }

        setLoading(false)
    }, [url])

    return {
        items,
        setItems,
        load,
        loading,

    }
}

export function useCommentsFetch(url){
    const [loading, setLoading] = useState(false)
    const [comments, setComments] = useState([])
    const load = useCallback(async () => {

        setLoading(true)
        try {
        const response  = await jsonFetch( url)
        setComments(comments => [...comments, ...response.comments])

        } catch(error) {
            console.error(error)
        }

        setLoading(false)
    }, [url])

    return {
        comments,
        setComments,
        load,
        loading,

    }
}


export function useFetch(url, method ='POST', callback = null){

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const load = useCallback(async(data = null) => {
        setLoading(true)
        try{
            const response = await jsonFetch(url, method, data)
            setLoading(false)
            if(callback){
                callback(response)
            }
            
        } catch (error) {
            setLoading(false)
            if(error.violations){
                setErrors(error.violations.reduce((acc, violation)=>{
                    acc[violation.propertyPath] = violation.message
                    return acc
                }, {}))
            } else {
                throw error
            }
        }
        
      
        
    }, [url, method, callback])

    const clearError = useCallback((name) => {
        if(errors[name]){
            setErrors(errors => ({...errors, [name]:null}))
        }
        
    }, [errors])
    return {
        loading,
        errors,
        load,
        clearError
    }

}