@extends('layouts.app')

@section('content')
        <status-comments data-username="{{ auth()->user()->name}}" data-user="{{ auth()->user()->id}}">
        </status-comments>
   
@endsection