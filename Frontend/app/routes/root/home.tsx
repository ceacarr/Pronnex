import React from 'react'
import type { Route } from './+types/home';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pronnex" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const Home = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center gap-2">
      <Link to ="/sign-in">
      <Button className="bg-primary text-primary-foreground hover:bg-primary/80">Sign-In</Button>
      </Link>
      
    <Link to="/sign-up">
      <Button 
      variant="outline"
      className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
        Sign Up
      </Button>
    </Link>
    </div>
  );
};

export default Home